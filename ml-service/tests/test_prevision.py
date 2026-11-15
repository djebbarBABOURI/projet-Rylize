import pytest

from app.prevision import mois_suivant, plage_mois, prevoir, prevoir_serie, totaux_mensuels
from tests.conftest import depense


def test_mois_suivant_et_plage_a_cheval_sur_deux_annees():
    assert mois_suivant("2026-12") == "2027-01"
    assert mois_suivant("2026-03") == "2026-04"
    assert plage_mois("2026-11", "2027-02") == ["2026-11", "2026-12", "2027-01", "2027-02"]


def test_totaux_mensuels_excluent_le_mois_courant_et_comblent_les_trous():
    depenses = [
        depense("2026-08-10", "nourriture", 50),
        depense("2026-08-20", "nourriture", 25.5),
        depense("2026-10-05", "nourriture", 40),   # septembre est vide -> 0
        depense("2026-11-02", "nourriture", 999),  # mois courant : exclu
    ]
    assert totaux_mensuels(depenses, "2026-11") == [("2026-08", 75.5), ("2026-09", 0.0), ("2026-10", 40.0)]
    assert totaux_mensuels(depenses, "2026-11", "transport") == []


def test_serie_constante_prevision_proche_et_intervalle_etroit():
    p = prevoir_serie([500, 500, 500, 500, 500, 500])
    assert p["disponible"]
    assert p["valeur"] == pytest.approx(500, abs=1)
    assert p["haut"] - p["bas"] < 5


def test_serie_croissante_choisit_la_tendance():
    p = prevoir_serie([100, 150, 200, 250, 300, 350, 400])
    assert p["modele"] == "tendance"
    assert p["valeur"] == pytest.approx(450, rel=0.1)


def test_serie_stable_ne_choisit_pas_la_tendance():
    p = prevoir_serie([300, 310, 295, 305, 300, 298, 302, 301])
    assert p["modele"] in {"moyenne", "ewma"}
    assert p["valeur"] == pytest.approx(300, abs=15)


def test_intervalle_encadre_la_valeur_et_reste_positif():
    p = prevoir_serie([10, 400, 20, 350, 15, 500])
    assert 0 <= p["bas"] <= p["valeur"] <= p["haut"]


def test_pas_assez_de_mois():
    p = prevoir_serie([100, 200])
    assert p["disponible"] is False
    assert "3 mois" in p["raison"]


def test_prevoir_sur_un_historique_realiste(historique):
    r = prevoir(historique, "2026-11")
    assert r["moisCible"] == "2026-11"
    assert r["total"]["disponible"]
    # Le mois cible doit être proche du total mensuel moyen observé (série stationnaire)
    moyenne_reelle = sum(v for _, v in totaux_mensuels(historique, "2026-11")) / 8
    assert r["total"]["valeur"] == pytest.approx(moyenne_reelle, rel=0.10)
    assert r["parCategorie"][0]["categorie"] == "logement"
    assert r["parCategorie"][0]["valeur"] == pytest.approx(620, abs=1)
    assert len(r["historique"]) == 8
    assert r["parCategorie"] == sorted(r["parCategorie"], key=lambda c: c["valeur"], reverse=True)


def test_prevoir_sans_depense():
    r = prevoir([], "2026-11")
    assert r["total"]["disponible"] is False
    assert r["parCategorie"] == []
