"""Évalue le classifieur de catégories : validation croisée stratifiée sur le jeu de départ
et robustesse aux fautes de frappe.   Usage : python -m scripts.evaluer   (depuis ml-service/)
"""
import random

import numpy as np
from sklearn.model_selection import StratifiedKFold

from app.categorie import ClassifieurCategorie, construire_pipeline, normaliser
from app.donnees_base import exemples_base


def faute(texte: str, rng: random.Random) -> str:
    """Introduit une faute de frappe (suppression, doublon ou inversion d'une lettre)."""
    if len(texte) < 4:
        return texte
    i = rng.randrange(1, len(texte) - 1)
    action = rng.choice(["suppr", "double", "inverse"])
    if action == "suppr":
        return texte[:i] + texte[i + 1:]
    if action == "double":
        return texte[:i] + texte[i] + texte[i:]
    return texte[:i] + texte[i + 1] + texte[i] + texte[i + 2:]


def main() -> None:
    donnees = exemples_base()
    X = np.array([normaliser(t) for t, _ in donnees])
    y = np.array([c for _, c in donnees])
    rng = random.Random(0)

    exact, bruite, top3 = [], [], []
    for train, test in StratifiedKFold(n_splits=5, shuffle=True, random_state=0).split(X, y):
        modele = construire_pipeline().fit(X[train], y[train])
        exact.append(np.mean(modele.predict(X[test]) == y[test]))
        # précision top-3 : la bonne catégorie figure parmi les 3 suggestions affichées
        probas = modele.predict_proba(X[test])
        meilleurs = np.argsort(probas, axis=1)[:, ::-1][:, :3]
        top3.append(np.mean([y[test][i] in modele.classes_[meilleurs[i]] for i in range(len(test))]))
        bruite.append(np.mean(modele.predict([faute(t, rng) for t in X[test]]) == y[test]))

    print(f"Exemples : {len(donnees)} | catégories : {len(set(y))}")
    print(f"Précision (validation croisée 5 plis)      : {np.mean(exact):.1%} ± {np.std(exact):.1%}")
    print(f"Précision top-3 (parmi les 3 suggestions)  : {np.mean(top3):.1%} ± {np.std(top3):.1%}")
    print(f"Précision avec une faute de frappe ajoutée : {np.mean(bruite):.1%} ± {np.std(bruite):.1%}")

    clf = ClassifieurCategorie().entrainer()
    for phrase in ["Carrefour city", "recharge navigo", "abonnement netflx", "dentiste", "edf", "cadeau maman"]:
        top = clf.predire(phrase, k=2)
        print(f"  {phrase!r:22} -> " + ", ".join(f"{s.categorie} ({s.probabilite:.0%})" for s in top))


if __name__ == "__main__":
    main()
