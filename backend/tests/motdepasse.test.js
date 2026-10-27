import test from "node:test";
import assert from "node:assert/strict";
import { verifierNouveauMdp } from "../outils/validationMdp.js";

test("verifierNouveauMdp accepte un mot de passe valide", () => {
    assert.equal(verifierNouveauMdp("Rylize2026"), null);
});

test("verifierNouveauMdp refuse les mots de passe trop courts ou sans chiffre/lettre", () => {
    assert.match(verifierNouveauMdp("abc1"), /au moins 8/);
    assert.match(verifierNouveauMdp("abcdefghij"), /lettre et un chiffre/);
    assert.match(verifierNouveauMdp("1234567890"), /lettre et un chiffre/);
});

test("verifierNouveauMdp refuse > 72 octets (limite bcrypt) et les types invalides", () => {
    assert.match(verifierNouveauMdp("a1".repeat(40)), /trop long/);
    assert.ok(verifierNouveauMdp(undefined));
    assert.ok(verifierNouveauMdp({ $ne: "" }));
});
