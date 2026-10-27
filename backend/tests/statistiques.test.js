import test from "node:test";
import assert from "node:assert/strict";
import { construirePipelineStats, formaterStats, construirePipelineResume, formaterResume } from "../services/statistiques.service.js";
import { bornesMois, lirePeriode } from "../outils/periode.js";
import { JEU, agreger } from "./utils.js";

test("statistiques globales : total, moyenne, répartition par catégorie et par mois", () => {
    const [brut] = agreger(JEU, construirePipelineStats("u1"));
    const s = formaterStats(brut);

    assert.equal(s.total, 310); // 30+70+40.5+25+19.5+60+15+50
    assert.equal(s.nombre, 8);
    assert.equal(s.moyenne, 38.75);
    assert.equal(s.max, 70);

    assert.deepEqual(s.parCategorie.map((c) => [c.categorie, c.total]), [
        ["nourriture", 180],
        ["transport", 90],
        ["loisirs", 40],
    ]);
    assert.equal(s.parCategorie[0].part, 58.1);
    assert.deepEqual(s.parMois.map((m) => [m.mois, m.total]), [
        ["2026-09", 100],
        ["2026-10", 145],
        ["2026-11", 65],
    ]);
});

test("statistiques sur une période", () => {
    const { du, au } = lirePeriode({ du: "2026-10-01", au: "2026-10-31" });
    const [brut] = agreger(JEU, construirePipelineStats("u1", { du, au }));
    const s = formaterStats(brut);
    assert.equal(s.total, 145);
    assert.equal(s.parMois.length, 1);
});

test("statistiques sans dépense : valeurs à zéro, pas d'erreur", () => {
    const [brut] = agreger(JEU, construirePipelineStats("inconnu"));
    const s = formaterStats(brut);
    assert.equal(s.total, 0);
    assert.deepEqual(s.parCategorie, []);
});

test("bornesMois : format, mois suivant/précédent et durée", () => {
    const b = bornesMois("2026-02");
    assert.equal(b.cle, "2026-02");
    assert.equal(b.jours, 28);
    assert.equal(b.debutPrecedent.toISOString(), "2026-01-01T00:00:00.000Z");
    assert.equal(bornesMois("2026-01").debutPrecedent.toISOString(), "2025-12-01T00:00:00.000Z");
    assert.ok(bornesMois("2026-13").erreur);
    assert.ok(bornesMois("octobre").erreur);
    assert.equal(bornesMois(undefined, new Date("2026-11-14T10:00:00Z")).cle, "2026-11");
});

test("résumé mensuel d'un mois passé : variation vs mois précédent", () => {
    const bornes = bornesMois("2026-10");
    const [brut] = agreger(JEU, construirePipelineResume("u1", bornes));
    const r = formaterResume(brut, bornes, new Date("2026-11-14T10:00:00Z"));
    assert.equal(r.total, 145);
    assert.equal(r.nombre, 4);
    assert.equal(r.totalPrecedent, 100);
    assert.equal(r.variation, 45); // +45 %
    assert.equal(r.moyenneJournaliere, 4.68); // 145 / 31
    assert.equal(r.projection, null); // mois terminé
    // nourriture et transport totalisent 60 : en cas d'égalité, l'ordre alphabétique départage
    assert.deepEqual(r.categorieTop, { categorie: "nourriture", total: 60 });
});

test("résumé du mois en cours : projection sur les jours écoulés", () => {
    const bornes = bornesMois("2026-11", new Date("2026-11-14T10:00:00Z"));
    const [brut] = agreger(JEU, construirePipelineResume("u1", bornes));
    const r = formaterResume(brut, bornes, new Date("2026-11-14T10:00:00Z"));
    assert.equal(r.total, 65);
    assert.equal(r.variation, -55.2); // (65-145)/145
    assert.equal(r.moyenneJournaliere, 4.64); // 65 / 14 jours
    assert.equal(r.projection, 139.29); // 65/14*30
});

test("résumé sans variation quand le mois précédent est vide", () => {
    const bornes = bornesMois("2026-09");
    const [brut] = agreger(JEU, construirePipelineResume("u1", bornes));
    const r = formaterResume(brut, bornes, new Date("2026-11-14T10:00:00Z"));
    assert.equal(r.variation, null);
});
