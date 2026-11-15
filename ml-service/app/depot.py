"""Accès en lecture seule aux données MongoDB (collections créées par Mongoose côté Node)."""
from __future__ import annotations

from typing import Protocol

from bson import ObjectId
from pymongo import MongoClient


class Depot(Protocol):
    """Interface minimale : permet de remplacer MongoDB par un faux dépôt dans les tests."""

    def depenses(self, user_id: str) -> list[dict]: ...
    def categories(self, user_id: str) -> list[str]: ...
    def ping(self) -> bool: ...


class DepotMongo:
    def __init__(self, uri: str) -> None:
        self.client = MongoClient(uri, serverSelectionTimeoutMS=5000, tz_aware=False)
        self.db = self.client.get_default_database(default="rylize")

    def depenses(self, user_id: str) -> list[dict]:
        curseur = self.db["depenses"].find(
            {"userId": ObjectId(user_id)},
            {"montant": 1, "categorie": 1, "date": 1, "description": 1, "updatedAt": 1},
        )
        return [
            {
                "id": str(d["_id"]),
                "montant": float(d["montant"]),
                "categorie": d["categorie"],
                "date": d["date"],
                "description": d.get("description", "") or "",
                "maj": d.get("updatedAt"),
            }
            for d in curseur
        ]

    def categories(self, user_id: str) -> list[str]:
        return [c["nom"] for c in self.db["categories"].find({"userId": ObjectId(user_id)}, {"nom": 1})]

    def ping(self) -> bool:
        try:
            self.client.admin.command("ping")
            return True
        except Exception:
            return False
