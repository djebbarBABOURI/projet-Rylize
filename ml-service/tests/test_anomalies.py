from datetime import datetime

from app.anomalies import MIN_DEPENSES, detecter_anomalies
from tests.conftest import depense


def test_detecte_une_depense_tres_superieure_a_l_habitude(historique):
    historique.append(depense("2026-10-15", "nourriture", 480, "banquet", id_="grosse"))
    r = detecter_anomalies(historique)
    assert r["disponible"]
    assert "grosse" in [a["id"] for a in r["anomalies"]]
    a = next(a for a in r["anomalies"] if a["id"] == "grosse")
    assert a["ratio"] > 8
    assert "nourriture" in a["raison"]


def test_peu_de_fausses_alertes_sur_un_historique_normal(historique):
    r = detecter_anomalies(historique)
    # Le loyer fixe, les petites courses, etc. ne doivent presque jamais être signalés
    assert len(r["anomalies"]) <= 2


def test_une_depense_basse_n_est_jamais_signalee(historique):
    historique.append(depense("2026-10-15", "nourriture", 0.5, "bonbon", id_="petite"))
    r = detecter_anomalies(historique)
    assert "petite" not in [a["id"] for a in r["anomalies"]]


def test_filtre_par_periode(historique):
    historique.append(depense("2026-05-15", "nourriture", 500, "ancienne", id_="mai"))
    historique.append(depense("2026-10-15", "nourriture", 500, "recente", id_="octobre"))
    r = detecter_anomalies(historique, du=datetime(2026, 10, 1), au=datetime(2026, 10, 31, 23, 59, 59))
    ids = [a["id"] for a in r["anomalies"]]
    assert "octobre" in ids and "mai" not in ids


def test_historique_trop_court():
    r = detecter_anomalies([depense("2026-10-01", "nourriture", 10)] * (MIN_DEPENSES - 1))
    assert r["disponible"] is False
    assert r["anomalies"] == []


def test_categorie_trop_rare_non_jugee(historique):
    historique.append(depense("2026-10-20", "voyage", 3000, "vacances", id_="rare"))
    r = detecter_anomalies(historique)
    assert "rare" not in [a["id"] for a in r["anomalies"]]  # une seule dépense : pas de référence


def test_resultats_tries_par_score(historique):
    historique += [depense("2026-10-10", "nourriture", 400, id_="a"), depense("2026-10-11", "nourriture", 900, id_="b")]
    scores = [a["score"] for a in detecter_anomalies(historique)["anomalies"]]
    assert scores == sorted(scores, reverse=True)
