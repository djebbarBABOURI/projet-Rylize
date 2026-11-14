// Tests d'intégration HTTP : l'application Express est démarrée pour de vrai,
// les modèles Mongoose sont simulés (pas de serveur MongoDB nécessaire).
import test, { before, after, mock } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import jsonwebtoken from "jsonwebtoken";

process.env.MONGO_DB_URI = "mongodb://127.0.0.1:1/test";
process.env.JWT_SECRET = "secret-de-test";

const { default: app } = await import("../app.js");
const { default: Utilisateur } = await import("../model/utilisateur.model.js");
const { default: Depense } = await import("../model/depense.model.js");

const utilisateur = { _id: new mongoose.Types.ObjectId(), nom: "Test" };
utilisateur.id = utilisateur._id.toString();
const cookie = `jwt=${jsonwebtoken.sign({ id_utilisateur: utilisateur.id }, process.env.JWT_SECRET)}`;

let serveur;
let base;

before(async () => {
    mock.method(Utilisateur, "findById", () => ({ select: async () => utilisateur }));
    serveur = app.listen(0);
    base = `http://127.0.0.1:${serveur.address().port}`;
});

after(() => {
    serveur.close();
    mock.restoreAll();
});

const appel = (chemin, options = {}) =>
    fetch(base + chemin, {
        ...options,
        headers: { "Content-Type": "application/json", cookie, ...(options.headers || {}) },
    });

test("GET /api/sante répond 503 quand MongoDB est déconnecté", async () => {
    const res = await fetch(`${base}/api/sante`);
    assert.equal(res.status, 503);
    assert.equal((await res.json()).mongodb, "deconnecte");
});

test("les routes protégées exigent une authentification", async () => {
    for (const chemin of ["/api/depenses/getDepenses/", "/api/categories", "/api/budgets", "/api/statistiques", "/api/depenses/export"]) {
        const res = await fetch(base + chemin);
        assert.equal(res.status, 401, chemin);
    }
});

test("export CSV : filtre sur l'utilisateur connecté et renvoie un fichier CSV", async () => {
    let filtreRecu;
    mock.method(Depense, "find", (filtre) => {
        filtreRecu = filtre;
        return { sort: () => ({ limit: () => ({ lean: async () => [
            { date: new Date("2026-11-03"), categorie: "loisirs", montant: 15, description: "Cinéma; soirée" },
        ] }) }) };
    });
    const res = await appel("/api/depenses/export?categorie=Loisirs&du=2026-11-01");
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type"), /text\/csv/);
    assert.match(res.headers.get("content-disposition"), /attachment; filename="depenses-\d{4}-\d{2}-\d{2}\.csv"/);
    const corps = await res.text();
    assert.ok(corps.includes('2026-11-03;loisirs;15,00;"Cinéma; soirée"'));
    assert.equal(String(filtreRecu.userId), utilisateur.id);
    assert.deepEqual(filtreRecu.categorie, { $in: ["loisirs"] });
    Depense.find.mock.restore();
});

test("POST ajoutDepense : refuse un corps invalide avec le détail des erreurs", async () => {
    const res = await appel(`/api/depenses/ajoutDepense/${utilisateur.id}`, {
        method: "POST",
        body: JSON.stringify({ montant: -3, categorie: "", date: "nimporte quoi" }),
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.ok(data.error);
    assert.deepEqual(Object.keys(data.erreurs).sort(), ["categorie", "date", "montant"]);
});

test("PATCH modifUtilisateur : on ne peut pas modifier le profil d'un autre", async () => {
    const res = await appel(`/api/utilisateur/modifUtilisateur/${new mongoose.Types.ObjectId()}`, {
        method: "PATCH",
        body: JSON.stringify({ nom: "Pirate", mdp: "x" }),
    });
    assert.equal(res.status, 403);
});

test("DELETE deleteDepenses : refuse une liste d'identifiants invalide", async () => {
    for (const ids of [undefined, [], ["pas-un-id"], { $ne: null }]) {
        const res = await appel("/api/depenses/deleteDepenses/", { method: "DELETE", body: JSON.stringify({ ids }) });
        assert.equal(res.status, 400);
    }
});

test("GET budgets et statistiques : paramètres invalides renvoient 400", async () => {
    assert.equal((await appel("/api/budgets?mois=2026-13")).status, 400);
    assert.equal((await appel("/api/statistiques/resume?mois=nimporte")).status, 400);
    assert.equal((await appel("/api/statistiques?du=zzz")).status, 400);
});

test("PATCH motdepasse : valide la confirmation et la politique de mot de passe", async () => {
    const corps = (b) => ({ method: "PATCH", body: JSON.stringify(b) });
    let res = await appel("/api/utilisateur/motdepasse", corps({ ancienMdp: "a", nouveauMdp: "Abcdefg1", confirmation: "autre" }));
    assert.equal(res.status, 400);
    res = await appel("/api/utilisateur/motdepasse", corps({ ancienMdp: "a", nouveauMdp: "court", confirmation: "court" }));
    assert.equal(res.status, 400);
    assert.match((await res.json()).error, /au moins 8/);
});
