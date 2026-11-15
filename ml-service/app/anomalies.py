"""Détection de dépenses inhabituelles.

Deux signaux sont combinés pour limiter les fausses alertes :
  1. une IsolationForest, entraînée sur tout l'historique de l'utilisateur ;
  2. un score robuste (médiane / MAD du log du montant) au sein de la catégorie.
Une dépense n'est signalée que si les deux sont d'accord ET qu'elle est plus élevée que d'habitude.
"""
from __future__ import annotations

import numpy as np
from sklearn.ensemble import IsolationForest

MIN_DEPENSES = 30      # en dessous, l'historique est trop court pour parler d'anomalie
SEUIL_Z = 2.5          # score robuste minimal
MIN_PAR_CATEGORIE = 5  # nombre minimal de dépenses pour juger une catégorie
MAD_MIN = 0.15         # plancher du MAD (sur le log), évite de diviser par ~0 pour des montants constants


def _stats_categories(depenses: list[dict]) -> dict[str, tuple[float, float, float]]:
    """Par catégorie : (médiane du log, MAD du log, médiane du montant)."""
    groupes: dict[str, list[float]] = {}
    for d in depenses:
        groupes.setdefault(d["categorie"], []).append(float(d["montant"]))
    stats = {}
    for categorie, montants in groupes.items():
        if len(montants) < MIN_PAR_CATEGORIE:
            continue
        logs = np.log1p(montants)
        med = float(np.median(logs))
        mad = max(float(np.median(np.abs(logs - med))), MAD_MIN)
        stats[categorie] = (med, mad, float(np.median(montants)))
    return stats


def _z_robuste(montant: float, med: float, mad: float) -> float:
    return 0.6745 * (float(np.log1p(montant)) - med) / mad


def detecter_anomalies(depenses: list[dict], du=None, au=None, limite: int = 10) -> dict:
    """Retourne les dépenses inhabituelles de la période [du, au] (datetime, optionnels)."""
    if len(depenses) < MIN_DEPENSES:
        return {
            "disponible": False,
            "raison": f"Au moins {MIN_DEPENSES} dépenses sont nécessaires (vous en avez {len(depenses)})",
            "anomalies": [],
        }

    stats = _stats_categories(depenses)
    categories = sorted({d["categorie"] for d in depenses})
    indice = {c: i for i, c in enumerate(categories)}

    def caracteristiques(d: dict) -> list[float]:
        med, mad, _ = stats.get(d["categorie"], (float(np.log1p(d["montant"])), MAD_MIN, d["montant"]))
        return [float(np.log1p(d["montant"])), _z_robuste(d["montant"], med, mad), float(indice[d["categorie"]])]

    X = np.array([caracteristiques(d) for d in depenses])
    foret = IsolationForest(n_estimators=200, contamination="auto", random_state=0).fit(X)
    scores = -foret.score_samples(X)   # plus grand = plus atypique
    atypique = foret.predict(X) == -1

    anomalies = []
    for d, score, est_atypique in zip(depenses, scores, atypique):
        if (du and d["date"] < du) or (au and d["date"] > au):
            continue
        if d["categorie"] not in stats or not est_atypique:
            continue
        med, mad, med_montant = stats[d["categorie"]]
        z = _z_robuste(d["montant"], med, mad)
        if z < SEUIL_Z or d["montant"] <= med_montant:
            continue
        anomalies.append(
            {
                "id": d.get("id"),
                "date": d["date"].strftime("%Y-%m-%d"),
                "categorie": d["categorie"],
                "montant": round(float(d["montant"]), 2),
                "description": d.get("description", ""),
                "score": round(float(score), 3),
                "ratio": round(float(d["montant"]) / med_montant, 1) if med_montant > 0 else None,
                "raison": f"{d['montant'] / med_montant:.1f} fois la dépense habituelle en « {d['categorie']} » "
                          f"(médiane {med_montant:.0f} €)" if med_montant > 0 else "Montant inhabituel",
            }
        )
    anomalies.sort(key=lambda a: a["score"], reverse=True)
    return {"disponible": True, "anomalies": anomalies[:limite], "nbAnalysees": len(depenses)}
