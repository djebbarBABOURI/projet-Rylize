import test from "node:test";
import assert from "node:assert/strict";
import { associerBudgetsEtTotaux, calculerStatutBudget, construirePipelineTotauxMois } from "../services/budget.service.js";
import { bornesMois } from "../outils/periode.js";
import { JEU, agreger } from "./utils.js";

test("calculerStatutBudget : ok / attention / dépassé", () => {
    assert.deepEqual(calculerStatutBudget(100, 50), { depense: 50, reste: 50, pourcentage: 50, statut: "ok" });
    assert.equal(calculerStatutBudget(100, 80).statut, "attention");
    assert.equal(calculerStatutBudget(100, 100).statut, "attention"); // pile au budget : pas encore dépassé
    const d = calculerStatutBudget(100, 130.5);
    assert.equal(d.statut, "depasse");
    assert.equal(d.reste, -30.5);
    assert.equal(d.pourcentage, 130.5);
});

test("budgets associés aux totaux du mois (global + par catégorie)", () => {
    const totaux = agreger(JEU, construirePipelineTotauxMois("u1", bornesMois("2026-10")));
    const budgets = [
        { _id: "b2", categorie: "transport", montant: 50 },
        { _id: "b1", categorie: null, montant: 200 },
        { _id: "b3", categorie: "loisirs", montant: 100 },
        { _id: "b4", categorie: "logement", montant: 300 }, // aucune dépense ce mois-ci
    ];
    const r = associerBudgetsEtTotaux(budgets, totaux);

    assert.deepEqual(r.map((b) => b.categorie), [null, "logement", "loisirs", "transport"]);
    const parCat = Object.fromEntries(r.map((b) => [b.categorie, b]));
    assert.equal(parCat[null].depense, 145);
    assert.equal(parCat[null].statut, "ok");
    assert.equal(parCat.transport.statut, "depasse"); // 60 / 50
    assert.equal(parCat.loisirs.statut, "ok"); // 25 / 100
    assert.equal(parCat.logement.depense, 0);
});
