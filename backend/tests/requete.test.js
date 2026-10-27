import test from "node:test";
import assert from "node:assert/strict";
import { construireRequete } from "../services/depenseRequete.js";
import { JEU, trouver } from "./utils.js";

test("construireRequete filtre par catégories et période (fin incluse)", () => {
    const { filtre } = construireRequete("u1", { categorie: "Nourriture,loisirs", du: "2026-10-01", au: "2026-10-30" });
    const res = trouver(JEU, filtre);
    assert.equal(res.length, 3); // 40.5 (02/10), 25 (15/10), 19.5 (28/10)
    assert.ok(res.every((d) => d.userId === "u1"));
    // la date de fin est incluse : le 30/10 transport n'est pas retenu car la catégorie diffère,
    // mais une dépense du 30/10 d'une catégorie demandée le serait
    const { filtre: f2 } = construireRequete("u1", { categorie: "transport", du: "2026-10-01", au: "2026-10-30" });
    assert.equal(trouver(JEU, f2).length, 1);
});

test("construireRequete filtre par montant et recherche textuelle", () => {
    const { filtre } = construireRequete("u1", { min: "20", max: "50" });
    assert.deepEqual(trouver(JEU, filtre).map((d) => d.montant).sort((a, b) => a - b), [25, 30, 40.5, 50]);

    const { filtre: f2 } = construireRequete("u1", { q: "ciné" });
    assert.equal(trouver(JEU, f2).length, 1);
});

test("construireRequete échappe les caractères spéciaux de la recherche", () => {
    const { filtre } = construireRequete("u1", { q: ".*" });
    assert.equal(trouver(JEU, filtre).length, 0); // ".*" n'est pas interprété comme regex
});

test("construireRequete gère tri, pagination et paramètres invalides", () => {
    const r = construireRequete("u1", { tri: "montant", ordre: "asc", page: "3", limite: "500" });
    assert.deepEqual(r.tri, { montant: 1, _id: 1 });
    assert.deepEqual(r.pagination, { page: 3, limite: 100, skip: 200 });

    assert.equal(construireRequete("u1", {}).pagination, null);
    assert.ok(construireRequete("u1", { du: "zzz" }).erreur);
    assert.ok(construireRequete("u1", { min: "abc" }).erreur);
    // un champ de tri inconnu retombe sur la date
    assert.deepEqual(construireRequete("u1", { tri: "mdp" }).tri, { date: -1, _id: -1 });
});
