from datetime import datetime

import numpy as np
import pytest

UID = "64b7f0f2a1b2c3d4e5f60718"


def depense(date, categorie, montant, description="", id_=None):
    return {"id": id_, "date": datetime.fromisoformat(date), "categorie": categorie,
            "montant": float(montant), "description": description, "maj": None}


class FauxDepot:
    """Remplace MongoDB dans les tests."""

    def __init__(self, depenses=None, categories=None, en_ligne=True):
        self._depenses = depenses or []
        self._categories = categories or []
        self.en_ligne = en_ligne

    def depenses(self, user_id):
        return list(self._depenses)

    def categories(self, user_id):
        return list(self._categories)

    def ping(self):
        return self.en_ligne


@pytest.fixture
def historique():
    """8 mois (2026-03 à 2026-10) de dépenses réalistes et déterministes."""
    rng = np.random.RandomState(0)
    lignes = []
    for mois in range(3, 11):
        lignes.append(depense(f"2026-{mois:02d}-01", "logement", 620, "loyer"))
        for _ in range(14):
            jour = int(rng.randint(2, 28))
            lignes.append(depense(f"2026-{mois:02d}-{jour:02d}", "nourriture", round(rng.uniform(12, 65), 2), "courses carrefour"))
        for _ in range(5):
            jour = int(rng.randint(2, 28))
            lignes.append(depense(f"2026-{mois:02d}-{jour:02d}", "transport", round(rng.uniform(5, 40), 2), "uber"))
        for _ in range(3):
            jour = int(rng.randint(2, 28))
            lignes.append(depense(f"2026-{mois:02d}-{jour:02d}", "loisirs", round(rng.uniform(10, 45), 2), "cinéma"))
    return lignes
