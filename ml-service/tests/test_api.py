import pytest
from fastapi.testclient import TestClient

from app.main import creer_app
from app.service import ServiceML
from tests.conftest import UID, FauxDepot, depense


@pytest.fixture
def client(historique):
    depot = FauxDepot(historique, ["nourriture", "transport", "loisirs", "logement"])
    return TestClient(creer_app(ServiceML(depot), token="secret"))


ENTETE = {"X-ML-Token": "secret"}


def test_sante_ok_et_503_si_mongodb_est_injoignable(historique):
    ok = TestClient(creer_app(ServiceML(FauxDepot(historique)), token=""))
    assert ok.get("/sante").json()["statut"] == "ok"
    ko = TestClient(creer_app(ServiceML(FauxDepot(en_ligne=False)), token=""))
    assert ko.get("/sante").status_code == 503


def test_jeton_obligatoire(client):
    assert client.get(f"/prevision/{UID}").status_code == 401
    assert client.get(f"/prevision/{UID}", headers={"X-ML-Token": "faux"}).status_code == 401
    assert client.get(f"/prevision/{UID}", headers=ENTETE).status_code == 200


def test_suggestion_restreinte_aux_categories_de_l_utilisateur(client):
    r = client.post("/categorie/suggestion", headers=ENTETE, json={"userId": UID, "description": "ticket de cinéma"})
    assert r.status_code == 200
    data = r.json()
    assert data["suggestions"][0]["categorie"] == "loisirs"
    assert {s["categorie"] for s in data["suggestions"]} <= {"nourriture", "transport", "loisirs", "logement"}
    assert data["source"] == "personnalise"  # l'historique contient plus de 10 descriptions


def test_suggestion_validation_des_entrees(client):
    assert client.post("/categorie/suggestion", headers=ENTETE, json={"userId": "pas-un-id", "description": "x"}).status_code == 422
    assert client.post("/categorie/suggestion", headers=ENTETE, json={"userId": UID, "description": "x" * 201}).status_code == 422


def test_prevision_avec_mois_cible(client):
    r = client.get(f"/prevision/{UID}", headers=ENTETE, params={"mois": "2026-11"})
    assert r.status_code == 200 and r.json()["total"]["disponible"]
    assert client.get(f"/prevision/{UID}", headers=ENTETE, params={"mois": "2026-13"}).status_code == 422
    assert client.get("/prevision/abc", headers=ENTETE).status_code == 422


def test_anomalies_avec_periode(historique):
    historique.append(depense("2026-10-15", "nourriture", 500, "banquet", id_="x1"))
    c = TestClient(creer_app(ServiceML(FauxDepot(historique, ["nourriture"])), token=""))
    r = c.get(f"/anomalies/{UID}", params={"du": "2026-10-01", "au": "2026-10-31"})
    assert r.status_code == 200
    assert "x1" in [a["id"] for a in r.json()["anomalies"]]
    assert c.get(f"/anomalies/{UID}", params={"du": "n'importe quoi"}).status_code == 422


def test_le_modele_est_mis_en_cache_puis_reentraine_quand_les_donnees_changent(historique):
    depot = FauxDepot(historique, ["nourriture", "loisirs"])
    service = ServiceML(depot)
    service.suggerer(UID, "pain")
    premier = service._modeles[UID][1]
    service.suggerer(UID, "pain")
    assert service._modeles[UID][1] is premier          # réutilisé
    depot._depenses.append(depense("2026-10-30", "loisirs", 12, "nouvelle description"))
    service.suggerer(UID, "pain")
    assert service._modeles[UID][1] is not premier      # ré-entraîné : une dépense a été ajoutée
