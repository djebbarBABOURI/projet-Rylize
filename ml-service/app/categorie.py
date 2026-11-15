"""Suggestion automatique de catégorie à partir de la description d'une dépense.

Modèle : TF-IDF sur des n-grammes de caractères (robuste aux fautes de frappe et aux mots
inconnus, ex. "carrefourr" ou "netflx") suivi d'une régression logistique multiclasse.
"""
from __future__ import annotations

from dataclasses import dataclass

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

from .donnees_base import exemples_base

POIDS_BASE = 1.0
POIDS_UTILISATEUR = 3.0  # les dépenses réelles de l'utilisateur comptent plus que le jeu de départ


def normaliser(texte: str) -> str:
    return " ".join(str(texte).lower().split())


def construire_pipeline() -> Pipeline:
    return Pipeline(
        [
            (
                "tfidf",
                TfidfVectorizer(
                    analyzer="char_wb", ngram_range=(2, 5), strip_accents="unicode", sublinear_tf=True
                ),
            ),
            ("clf", LogisticRegression(C=20, max_iter=2000)),
        ]
    )


@dataclass
class Suggestion:
    categorie: str
    probabilite: float

    def en_dict(self) -> dict:
        return {"categorie": self.categorie, "probabilite": round(float(self.probabilite), 3)}


class ClassifieurCategorie:
    def __init__(self) -> None:
        self.pipeline: Pipeline | None = None
        self.nb_exemples_utilisateur = 0

    def entrainer(self, exemples_utilisateur: list[tuple[str, str]] | None = None) -> "ClassifieurCategorie":
        """Entraîne sur le jeu de départ + les dépenses de l'utilisateur (description, catégorie)."""
        utilisateur = [(normaliser(t), c) for t, c in (exemples_utilisateur or []) if str(t).strip() and c]
        base = [(normaliser(t), c) for t, c in exemples_base()]

        textes = [t for t, _ in base] + [t for t, _ in utilisateur]
        etiquettes = [c for _, c in base] + [c for _, c in utilisateur]
        poids = [POIDS_BASE] * len(base) + [POIDS_UTILISATEUR] * len(utilisateur)

        self.pipeline = construire_pipeline()
        self.pipeline.fit(textes, etiquettes, clf__sample_weight=np.array(poids))
        self.nb_exemples_utilisateur = len(utilisateur)
        return self

    @property
    def classes(self) -> list[str]:
        return list(self.pipeline.classes_) if self.pipeline else []

    def predire(
        self, description: str, categories_autorisees: list[str] | None = None, k: int = 3
    ) -> list[Suggestion]:
        """Retourne les k catégories les plus probables, restreintes à celles de l'utilisateur."""
        if self.pipeline is None:
            raise RuntimeError("Le modèle n'est pas entraîné")
        texte = normaliser(description)
        if not texte:
            return []

        probabilites = self.pipeline.predict_proba([texte])[0]
        classes = self.pipeline.classes_

        if categories_autorisees is not None:
            autorisees = {normaliser(c) for c in categories_autorisees}
            masque = np.array([c in autorisees for c in classes])
            if not masque.any():
                return []
            probabilites = np.where(masque, probabilites, 0.0)
            probabilites = probabilites / probabilites.sum()  # renormalise sur les catégories permises

        ordre = np.argsort(probabilites)[::-1][:k]
        return [Suggestion(str(classes[i]), probabilites[i]) for i in ordre if probabilites[i] > 0]
