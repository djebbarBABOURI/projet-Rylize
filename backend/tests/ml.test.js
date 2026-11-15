// Passerelle Node -> service ML : le service Python est simulé en interceptant fetch.
import test, { before, after, beforeEach, mock } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import jsonwebtoken from "jsonwebtoken";

process.env.MONGO_DB_URI = "mongodb://127.0.0.1:1/test";
process.env.JWT_SECRET = "secret-de-test";
process.env.ML_SERVICE_URL = "http://ml.interne:8001/";
process.env.ML_SERVICE_TOKEN = "jeton-partage";

const { default: app } = await import("../app.js");
const { default: config } = await import("../config/env.js");
const { default: Utilisateur } = await import("../model/utilisateur.model.js");

const utilisateur = { _id: new mongoose.Types.ObjectId(), nom: "Test" };
utilisateur.id = utilisateur._id.toString();
const cookie = `jwt=${jsonwebtoken.sign({ id_utilisateur: utilisateur.id }, process.env.JWT_SECRET)}`;

const fetchReel = globalThis.fetch;
let appelsML;
let reponseML;
let serveur;
let base;

before(() => {
    mock.method(Utilisateur, "findById", () => ({ select: async () => utilisateur }));
    // Seuls les appels vers le service ML sont interceptés ; les requêtes de test passent normalement
    globalThis.fetch = async (url, options) => {
        if (String(url).startsWith("http://ml.interne:8001")) {
            appelsML.push({ url: String(url), options });
            return reponseML(url, options);
        }
        return fetchReel(url, options);
    };
    serveur = app.listen(0);
    base = `http://127.0.0.1:${serveur.address().port}`;
});

after(() => {
    globalThis.fetch = fetchReel;
    serveur.close();
    mock.restoreAll();
});

beforeEach(() => {
    appelsML = [];
    config.mlUrl = "http://ml.interne:8001";
    reponseML = () => new Response(JSON.stringify({ ok: true }), { status: 200 });
});

const appel = (chemin) => fetchReel(base + chemin, { headers: { cookie } });

test("suggestion : l'identifiant vient de la session, le jeton est transmis", async () => {
    reponseML = () => new Response(JSON.stringify({ suggestions: [{ categorie: "loisirs", probabilite: 0.8 }], source: "base" }), { status: 200 });
    const res = await appel("/api/ml/categorie?description=ticket%20de%20cin%C3%A9ma&userId=64b7f0f2a1b2c3d4e5f60718");
    assert.equal(res.status, 200);
    assert.equal((await res.json()).suggestions[0].categorie, "loisirs");

    const { url, options } = appelsML[0];
    assert.equal(url, "http://ml.interne:8001/categorie/suggestion");
    assert.equal(options.headers["X-ML-Token"], "jeton-partage");
    const corps = JSON.parse(options.body);
    assert.equal(corps.userId, utilisateur.id); // le userId passé dans l'URL est ignoré
    assert.equal(corps.description, "ticket de cinéma");
});

test("suggestion : description absente, trop courte ou trop longue -> 400 sans appeler le service", async () => {
    for (const q of ["", "?description=a", `?description=${"x".repeat(201)}`]) {
        assert.equal((await appel(`/api/ml/categorie${q}`)).status, 400);
    }
    assert.equal(appelsML.length, 0);
});

test("prévision : transmet le mois validé et l'identifiant de session", async () => {
    const res = await appel("/api/ml/prevision?mois=2026-11");
    assert.equal(res.status, 200);
    assert.equal(appelsML[0].url, `http://ml.interne:8001/prevision/${utilisateur.id}?mois=2026-11`);
    assert.equal((await appel("/api/ml/prevision?mois=novembre")).status, 400);
});

test("anomalies : valide les dates et les transmet", async () => {
    const res = await appel("/api/ml/anomalies?du=2026-10-01&au=2026-10-31");
    assert.equal(res.status, 200);
    assert.equal(appelsML[0].url, `http://ml.interne:8001/anomalies/${utilisateur.id}?du=2026-10-01&au=2026-10-31`);
    assert.equal((await appel("/api/ml/anomalies?du=hier")).status, 400);
    assert.equal((await appel("/api/ml/anomalies?au=2026-02-31x")).status, 400);
});

test("service ML en panne ou erreur -> 503 propre, sans fuite d'information interne", async () => {
    reponseML = () => { throw new TypeError("connect ECONNREFUSED 10.0.0.5:8001"); };
    let res = await appel("/api/ml/prevision");
    assert.equal(res.status, 503);
    let data = await res.json();
    assert.equal(data.disponible, false);
    assert.ok(!JSON.stringify(data).includes("10.0.0.5"));

    reponseML = () => new Response("boom", { status: 500 });
    res = await appel("/api/ml/anomalies");
    assert.equal(res.status, 503);

    reponseML = () => new Response("{}", { status: 422 });
    res = await appel("/api/ml/anomalies");
    assert.equal(res.status, 502);
});

test("sans URL configurée : statut indisponible et 503, aucun appel réseau", async () => {
    config.mlUrl = "";
    assert.deepEqual(await (await appel("/api/ml/statut")).json(), { disponible: false });
    assert.equal((await appel("/api/ml/prevision")).status, 503);
    assert.equal(appelsML.length, 0);
});

test("statut : disponible quand /sante répond, indisponible sinon", async () => {
    assert.deepEqual(await (await appel("/api/ml/statut")).json(), { disponible: true });
    reponseML = () => new Response("{}", { status: 503 });
    assert.deepEqual(await (await appel("/api/ml/statut")).json(), { disponible: false });
});

test("les routes ML exigent une authentification", async () => {
    for (const chemin of ["/statut", "/categorie?description=pain", "/prevision", "/anomalies"]) {
        assert.equal((await fetchReel(`${base}/api/ml${chemin}`)).status, 401, chemin);
    }
});
