export const CATEGORIE_MAX = 50;
export const DESCRIPTION_MAX = 200;
export const MONTANT_MAX = 1_000_000_000;

// Valide et nettoie le corps d'une requête de dépense.
// Retourne { valide, erreurs: {champ: message}, valeurs: {champs nettoyés} }
export const validerDepense = (corps = {}) => {
    const erreurs = {};
    const valeurs = {};

    // Montant : accepte "12,50" et "12.50", arrondi à 2 décimales
    const montant = typeof corps.montant === "string"
        ? Number(corps.montant.trim().replace(",", "."))
        : corps.montant;
    if (typeof montant !== "number" || !Number.isFinite(montant) || montant <= 0 || montant > MONTANT_MAX) {
        erreurs.montant = "Le montant doit être un nombre positif.";
    } else {
        valeurs.montant = Math.round(montant * 100) / 100;
    }

    // Catégorie : chaîne non vide, normalisée en minuscules
    const categorie = typeof corps.categorie === "string" ? corps.categorie.trim().toLowerCase() : "";
    if (!categorie || categorie.length > CATEGORIE_MAX) {
        erreurs.categorie = `La catégorie est obligatoire (${CATEGORIE_MAX} caractères maximum).`;
    } else {
        valeurs.categorie = categorie;
    }

    // Date : chaîne ISO (ex. 2026-10-05) ou objet Date valide
    const date = corps.date ? new Date(corps.date) : null;
    if (!date || Number.isNaN(date.getTime())) {
        erreurs.date = "La date doit être valide.";
    } else {
        valeurs.date = date;
    }

    // Description : optionnelle
    if (corps.description !== undefined && corps.description !== null) {
        if (typeof corps.description !== "string" || corps.description.length > DESCRIPTION_MAX) {
            erreurs.description = `La description doit avoir moins de ${DESCRIPTION_MAX} caractères.`;
        } else {
            valeurs.description = corps.description.trim();
        }
    }

    return { valide: Object.keys(erreurs).length === 0, erreurs, valeurs };
};
