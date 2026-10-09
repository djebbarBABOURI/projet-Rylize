// Construit la requête MongoDB (filtre, tri, pagination) à partir des paramètres d'URL.
// Fonction pure : facile à tester sans base de données.

const CHAMPS_TRI = { date: "date", montant: "montant", categorie: "categorie", creation: "createdAt" };
const LIMITE_MAX = 100;

const echapperRegex = (texte) => texte.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const lireDate = (valeur) => {
    const d = new Date(valeur);
    return Number.isNaN(d.getTime()) ? null : d;
};

const lireNombre = (valeur) => {
    if (valeur === undefined || valeur === "") return undefined;
    const n = Number(String(valeur).replace(",", "."));
    return Number.isFinite(n) ? n : null;
};

/**
 * Paramètres supportés :
 *   categorie=transport,loisirs   du=2026-10-01   au=2026-10-31 (inclus)
 *   min=5   max=100   q=texte (description ou catégorie)
 *   tri=date|montant|categorie|creation   ordre=asc|desc
 *   page=1&limite=20 (sans "limite", toutes les dépenses sont renvoyées)
 * Retourne { filtre, tri, pagination } ou { erreur }.
 */
export const construireRequete = (userId, query = {}) => {
    const filtre = { userId };

    if (query.categorie) {
        const noms = String(query.categorie).split(",").map((c) => c.trim().toLowerCase()).filter(Boolean);
        if (noms.length > 0) filtre.categorie = { $in: noms };
    }

    if (query.du || query.au) {
        filtre.date = {};
        if (query.du) {
            const du = lireDate(query.du);
            if (!du) return { erreur: "Le paramètre 'du' n'est pas une date valide" };
            filtre.date.$gte = du;
        }
        if (query.au) {
            const au = lireDate(query.au);
            if (!au) return { erreur: "Le paramètre 'au' n'est pas une date valide" };
            au.setUTCHours(23, 59, 59, 999); // la date de fin est incluse
            filtre.date.$lte = au;
        }
    }

    const min = lireNombre(query.min);
    const max = lireNombre(query.max);
    if (min === null || max === null) return { erreur: "Les paramètres 'min' et 'max' doivent être des nombres" };
    if (min !== undefined || max !== undefined) {
        filtre.montant = {};
        if (min !== undefined) filtre.montant.$gte = min;
        if (max !== undefined) filtre.montant.$lte = max;
    }

    if (query.q) {
        const motif = new RegExp(echapperRegex(String(query.q).trim().slice(0, 100)), "i");
        filtre.$or = [{ description: motif }, { categorie: motif }];
    }

    const champ = CHAMPS_TRI[query.tri] || "date";
    const sens = query.ordre === "asc" ? 1 : -1;
    // _id départage les égalités pour que la pagination reste stable
    const tri = { [champ]: sens, _id: sens };

    let pagination = null;
    if (query.limite !== undefined) {
        const limite = Math.min(Math.max(parseInt(query.limite, 10) || 20, 1), LIMITE_MAX);
        const page = Math.max(parseInt(query.page, 10) || 1, 1);
        pagination = { page, limite, skip: (page - 1) * limite };
    }

    return { filtre, tri, pagination };
};
