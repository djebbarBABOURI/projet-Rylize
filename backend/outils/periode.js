// Utilitaires de dates (toutes les dates sont manipulées en UTC, comme les dépenses stockées)

export const arrondir = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

// Lit un intervalle { du, au } depuis les paramètres d'URL. La date de fin est incluse.
export const lirePeriode = ({ du, au } = {}) => {
    const periode = {};
    if (du) {
        const d = new Date(du);
        if (Number.isNaN(d.getTime())) return { erreur: "Le paramètre 'du' n'est pas une date valide" };
        periode.du = d;
    }
    if (au) {
        const a = new Date(au);
        if (Number.isNaN(a.getTime())) return { erreur: "Le paramètre 'au' n'est pas une date valide" };
        a.setUTCHours(23, 59, 59, 999);
        periode.au = a;
    }
    return periode;
};

// "2026-11" -> début du mois, début du mois suivant (exclu) et début du mois précédent.
// Sans argument, utilise le mois courant.
export const bornesMois = (mois, maintenant = new Date()) => {
    let annee = maintenant.getUTCFullYear();
    let m = maintenant.getUTCMonth();
    if (mois !== undefined && mois !== "") {
        const trouve = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(String(mois));
        if (!trouve) return { erreur: "Le paramètre 'mois' doit être au format AAAA-MM" };
        annee = Number(trouve[1]);
        m = Number(trouve[2]) - 1;
    }
    const debut = new Date(Date.UTC(annee, m, 1));
    const fin = new Date(Date.UTC(annee, m + 1, 1));
    const debutPrecedent = new Date(Date.UTC(annee, m - 1, 1));
    const jours = Math.round((fin - debut) / 86400000);
    const cle = `${annee}-${String(m + 1).padStart(2, "0")}`;
    return { cle, debut, fin, debutPrecedent, jours };
};
