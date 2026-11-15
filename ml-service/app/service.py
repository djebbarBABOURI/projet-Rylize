"""Orchestration : lit les données de l'utilisateur et appelle les modèles."""
from __future__ import annotations

from collections import OrderedDict
from datetime import datetime, timezone

from .anomalies import detecter_anomalies
from .categorie import ClassifieurCategorie
from .depot import Depot
from .prevision import cle_mois, prevoir

MIN_EXEMPLES_PERSONNALISE = 10  # à partir de là, on considère que le modèle est « personnalisé »


class ServiceML:
    def __init__(self, depot: Depot, taille_cache: int = 256) -> None:
        self.depot = depot
        self.taille_cache = taille_cache
        # Cache LRU des classifieurs : {user_id: (signature des données, classifieur)}
        self._modeles: OrderedDict[str, tuple[tuple, ClassifieurCategorie]] = OrderedDict()

    # -- Suggestion de catégorie ------------------------------------------------------------
    def _classifieur(self, user_id: str, depenses: list[dict]) -> ClassifieurCategorie:
        maj = max((d["maj"] for d in depenses if d.get("maj")), default=None)
        signature = (len(depenses), maj)
        en_cache = self._modeles.get(user_id)
        if en_cache and en_cache[0] == signature:
            self._modeles.move_to_end(user_id)
            return en_cache[1]

        exemples = [(d["description"], d["categorie"]) for d in depenses if d.get("description", "").strip()]
        modele = ClassifieurCategorie().entrainer(exemples)
        self._modeles[user_id] = (signature, modele)
        self._modeles.move_to_end(user_id)
        while len(self._modeles) > self.taille_cache:
            self._modeles.popitem(last=False)
        return modele

    def suggerer(self, user_id: str, description: str, k: int = 3) -> dict:
        depenses = self.depot.depenses(user_id)
        categories = self.depot.categories(user_id)
        modele = self._classifieur(user_id, depenses)
        suggestions = modele.predire(description, categories or None, k=k)
        return {
            "suggestions": [s.en_dict() for s in suggestions],
            "source": "personnalise" if modele.nb_exemples_utilisateur >= MIN_EXEMPLES_PERSONNALISE else "base",
            "nbExemplesUtilisateur": modele.nb_exemples_utilisateur,
        }

    # -- Prévision --------------------------------------------------------------------------
    def prevision(self, user_id: str, mois_cible: str | None = None) -> dict:
        mois = mois_cible or cle_mois(datetime.now(timezone.utc))
        return prevoir(self.depot.depenses(user_id), mois)

    # -- Anomalies --------------------------------------------------------------------------
    def anomalies(self, user_id: str, du: datetime | None = None, au: datetime | None = None) -> dict:
        return detecter_anomalies(self.depot.depenses(user_id), du, au)
