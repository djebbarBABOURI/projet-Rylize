import test from "node:test";
import assert from "node:assert/strict";
import { validerDepense } from "../outils/validationDepense.js";
import { echapperCellule, versCsv } from "../outils/csv.js";

test("validerDepense accepte une dépense correcte et normalise les valeurs", () => {
    const r = validerDepense({ montant: "12,555", categorie: "  Transport ", date: "2026-10-05", description: " Bus " });
    assert.equal(r.valide, true);
    assert.equal(r.valeurs.montant, 12.56);
    assert.equal(r.valeurs.categorie, "transport");
    assert.equal(r.valeurs.description, "Bus");
    assert.equal(r.valeurs.date.toISOString(), "2026-10-05T00:00:00.000Z");
});

test("validerDepense rejette montant, catégorie et date invalides", () => {
    const r = validerDepense({ montant: -5, categorie: "", date: "pas une date" });
    assert.equal(r.valide, false);
    assert.deepEqual(Object.keys(r.erreurs).sort(), ["categorie", "date", "montant"]);
});

test("validerDepense rejette les types inattendus (injection d'objet)", () => {
    const r = validerDepense({ montant: { $gt: 0 }, categorie: { $ne: "" }, date: "2026-10-05" });
    assert.equal(r.valide, false);
    assert.ok(r.erreurs.montant && r.erreurs.categorie);
});

test("validerDepense limite la description à 200 caractères", () => {
    const r = validerDepense({ montant: 1, categorie: "a", date: "2026-10-05", description: "x".repeat(201) });
    assert.ok(r.erreurs.description);
});

test("echapperCellule neutralise les formules et protège les séparateurs", () => {
    assert.equal(echapperCellule("=1+1"), "'=1+1");
    assert.equal(echapperCellule("a;b"), '"a;b"');
    assert.equal(echapperCellule('dit "oui"'), '"dit ""oui"""');
    assert.equal(echapperCellule(null), "");
});

test("versCsv produit un CSV avec BOM, virgule décimale et CRLF", () => {
    const csv = versCsv([{ date: "2026-10-05T00:00:00Z", categorie: "loisirs", montant: 12.5, description: "" }]);
    assert.ok(csv.startsWith("﻿Date;Catégorie;Montant;Description\r\n"));
    assert.ok(csv.includes("2026-10-05;loisirs;12,50;\r\n"));
});
