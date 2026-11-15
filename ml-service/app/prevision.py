"""Prévision des dépenses mensuelles.

On dispose de peu de points (un par mois), donc on privilégie des modèles simples et on laisse
les données choisir : trois modèles candidats sont comparés par validation « walk-forward »
(on prédit chaque mois à partir des seuls mois précédents) et le meilleur par utilisateur et par
catégorie est retenu. L'incertitude est estimée à partir des erreurs observées en validation.
"""
from __future__ import annotations

from collections import defaultdict
from datetime import date, datetime

import numpy as np
from sklearn.linear_model import Ridge

MIN_MOIS = 3          # en dessous, aucune prévision fiable
FENETRE_TENDANCE = 6  # nombre de mois récents utilisés par le modèle de tendance
Z_80 = 1.2816         # quantile de la loi normale pour un intervalle à 80 %


def cle_mois(d: date | datetime) -> str:
    return f"{d.year:04d}-{d.month:02d}"


def mois_suivant(cle: str) -> str:
    annee, mois = int(cle[:4]), int(cle[5:7])
    annee, mois = (annee + 1, 1) if mois == 12 else (annee, mois + 1)
    return f"{annee:04d}-{mois:02d}"


def plage_mois(debut: str, fin: str) -> list[str]:
    """Liste continue de mois de `debut` à `fin` inclus (les mois sans dépense comptent pour 0)."""
    mois, cle = [], debut
    while cle <= fin:
        mois.append(cle)
        cle = mois_suivant(cle)
    return mois


def totaux_mensuels(depenses: list[dict], mois_courant: str, categorie: str | None = None) -> list[tuple[str, float]]:
    """Totaux par mois COMPLET (strictement avant `mois_courant`), mois vides inclus."""
    totaux: dict[str, float] = defaultdict(float)
    for d in depenses:
        if categorie is not None and d["categorie"] != categorie:
            continue
        cle = cle_mois(d["date"])
        if cle < mois_courant:
            totaux[cle] += float(d["montant"])
    if not totaux:
        return []
    return [(m, round(totaux.get(m, 0.0), 2)) for m in plage_mois(min(totaux), _mois_precedent(mois_courant))]


def _mois_precedent(cle: str) -> str:
    annee, mois = int(cle[:4]), int(cle[5:7])
    annee, mois = (annee - 1, 12) if mois == 1 else (annee, mois - 1)
    return f"{annee:04d}-{mois:02d}"


# --- Modèles candidats : chacun prédit la valeur suivante à partir de l'historique -------------

def modele_moyenne(historique: np.ndarray) -> float:
    return float(np.mean(historique[-3:]))


def modele_ewma(historique: np.ndarray, alpha: float = 0.5) -> float:
    niveau = historique[0]
    for v in historique[1:]:
        niveau = alpha * v + (1 - alpha) * niveau
    return float(niveau)


def modele_tendance(historique: np.ndarray) -> float:
    recent = historique[-FENETRE_TENDANCE:]
    if len(recent) < 3:
        return modele_moyenne(historique)
    x = np.arange(len(recent), dtype=float).reshape(-1, 1)
    reg = Ridge(alpha=1.0).fit(x, recent)  # la régularisation évite les pentes extrêmes sur peu de points
    return float(reg.predict([[len(recent)]])[0])


MODELES = {"moyenne": modele_moyenne, "ewma": modele_ewma, "tendance": modele_tendance}


def prevoir_serie(valeurs: list[float]) -> dict:
    """Prévoit la prochaine valeur d'une série mensuelle. Retourne un dict prêt pour l'API."""
    y = np.asarray(valeurs, dtype=float)
    if len(y) < MIN_MOIS:
        return {"disponible": False, "raison": f"Au moins {MIN_MOIS} mois complets de dépenses sont nécessaires", "nbMois": int(len(y))}

    # Validation walk-forward : on prédit y[t] à partir de y[:t] pour chaque t à partir de 2
    erreurs: dict[str, list[float]] = {nom: [] for nom in MODELES}
    for t in range(2, len(y)):
        for nom, modele in MODELES.items():
            erreurs[nom].append(y[t] - max(modele(y[:t]), 0.0))

    mae = {nom: float(np.mean(np.abs(e))) for nom, e in erreurs.items()}
    meilleur = min(mae, key=mae.get)
    valeur = max(MODELES[meilleur](y), 0.0)

    ecart = float(np.std(erreurs[meilleur])) if len(erreurs[meilleur]) > 1 else float(np.std(y))
    demi_intervalle = Z_80 * ecart
    return {
        "disponible": True,
        "valeur": round(valeur, 2),
        "bas": round(max(valeur - demi_intervalle, 0.0), 2),
        "haut": round(valeur + demi_intervalle, 2),
        "modele": meilleur,
        "erreurMoyenne": round(mae[meilleur], 2),
        "nbMois": int(len(y)),
    }


def prevoir(depenses: list[dict], mois_cible: str, max_categories: int = 6) -> dict:
    """Prévision du total du mois `mois_cible` et des catégories principales, d'après les mois complets passés."""
    serie = totaux_mensuels(depenses, mois_cible)
    resultat = {"moisCible": mois_cible, "total": prevoir_serie([v for _, v in serie]), "parCategorie": []}
    resultat["historique"] = [{"mois": m, "total": v} for m, v in serie]

    par_categorie = []
    for categorie in sorted({d["categorie"] for d in depenses}):
        s = totaux_mensuels(depenses, mois_cible, categorie)
        p = prevoir_serie([v for _, v in s])
        if p["disponible"]:
            par_categorie.append({"categorie": categorie, **{k: p[k] for k in ("valeur", "bas", "haut", "modele")}})
    par_categorie.sort(key=lambda c: c["valeur"], reverse=True)
    resultat["parCategorie"] = par_categorie[:max_categories]
    return resultat
