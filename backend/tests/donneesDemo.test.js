import test from "node:test";
import assert from "node:assert/strict";
import { genererDepensesDemo } from "../scripts/donneesDemo.js";
import { validerDepense } from "../outils/validationDepense.js";

const MAINTENANT = new Date("2026-11-14T10:00:00Z");

test("les données de démo sont déterministes et couvrent les 4 derniers mois", () => {
    const a = genererDepensesDemo("u1", MAINTENANT);
    const b = genererDepensesDemo("u1", MAINTENANT);
    assert.deepEqual(a, b);
    assert.ok(a.length > 80);
    const dates = a.map((d) => d.date.getTime());
    assert.equal(new Date(Math.min(...dates)).toISOString().slice(0, 10), "2026-08-01");
    assert.ok(Math.max(...dates) <= MAINTENANT.getTime());
});

test("chaque dépense générée passe la validation serveur", () => {
    for (const d of genererDepensesDemo("u1", MAINTENANT)) {
        assert.equal(validerDepense(d).valide, true, JSON.stringify(d));
    }
});
