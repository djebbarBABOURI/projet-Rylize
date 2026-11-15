import pytest

from app.categorie import ClassifieurCategorie
from app.donnees_base import exemples_base


@pytest.fixture(scope="module")
def modele_base():
    return ClassifieurCategorie().entrainer()


@pytest.mark.parametrize(
    "description, attendue",
    [("dentiste", "santé"), ("recharge navigo", "transport"), ("abonnement netflix", "loisirs"),
     ("carrefour city", "nourriture"), ("cadeau maman", "autres"), ("facture edf", "logement")],
)
def test_predictions_de_base(modele_base, description, attendue):
    assert modele_base.predire(description)[0].categorie == attendue


def test_robuste_aux_fautes_de_frappe(modele_base):
    assert modele_base.predire("abonnement netflx")[0].categorie == "loisirs"
    assert modele_base.predire("carrefourr")[0].categorie == "nourriture"


def test_les_probabilites_sont_triees_et_valides(modele_base):
    suggestions = modele_base.predire("pharmacie", k=3)
    probas = [s.probabilite for s in suggestions]
    assert len(suggestions) == 3
    assert probas == sorted(probas, reverse=True)
    assert all(0 < p <= 1 for p in probas)


def test_restriction_aux_categories_de_l_utilisateur(modele_base):
    suggestions = modele_base.predire("cinéma", categories_autorisees=["nourriture", "transport"])
    assert {s.categorie for s in suggestions} <= {"nourriture", "transport"}
    assert sum(s.probabilite for s in suggestions) == pytest.approx(1.0, abs=1e-6)


def test_aucune_categorie_connue_retourne_vide(modele_base):
    assert modele_base.predire("cinéma", categories_autorisees=["abonnements"]) == []


def test_description_vide(modele_base):
    assert modele_base.predire("   ") == []


def test_le_modele_apprend_les_habitudes_de_l_utilisateur():
    # Cet utilisateur range "starbucks" en loisirs et utilise une catégorie perso "abonnements"
    perso = [("starbucks", "loisirs")] * 6 + [("amazon prime", "abonnements")] * 6 + [("ledger", "abonnements")] * 3
    modele = ClassifieurCategorie().entrainer(perso)
    assert modele.nb_exemples_utilisateur == 15
    assert modele.predire("starbucks")[0].categorie == "loisirs"
    assert modele.predire("amazon prime")[0].categorie == "abonnements"
    assert "abonnements" in modele.classes


def test_exemples_utilisateur_vides_ou_sans_categorie_ignores():
    modele = ClassifieurCategorie().entrainer([("", "loisirs"), ("   ", "loisirs"), ("truc", "")])
    assert modele.nb_exemples_utilisateur == 0


def test_predire_avant_entrainement_leve_une_erreur():
    with pytest.raises(RuntimeError):
        ClassifieurCategorie().predire("pain")


def test_jeu_de_depart_equilibre():
    from collections import Counter

    comptes = Counter(c for _, c in exemples_base())
    assert len(comptes) == 6
    assert min(comptes.values()) >= 60
