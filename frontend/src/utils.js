// Fonctions utilitaires partagées par les pages

export const formaterMontant = (montant) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(montant ?? 0);

// Les dates sont stockées à minuit UTC : on les affiche en UTC pour éviter un décalage d'un jour
export const formaterDate = (dateISO) =>
    new Date(dateISO).toLocaleDateString("fr-FR", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "UTC" });

export const capitaliser = (texte = "") => texte.charAt(0).toUpperCase() + texte.slice(1);

const iso = (d) => d.toISOString().slice(0, 10);

export const PERIODES = [
    { valeur: "mois", libelle: "Ce mois-ci" },
    { valeur: "3mois", libelle: "3 derniers mois" },
    { valeur: "annee", libelle: "Cette année" },
    { valeur: "tout", libelle: "Tout" },
];

// Convertit un choix de période en paramètres du/au pour l'API
export const calculerPeriode = (periode, maintenant = new Date()) => {
    const a = maintenant.getUTCFullYear();
    const m = maintenant.getUTCMonth();
    switch (periode) {
        case "mois":
            return { du: iso(new Date(Date.UTC(a, m, 1))), au: iso(new Date(Date.UTC(a, m + 1, 0))) };
        case "3mois":
            return { du: iso(new Date(Date.UTC(a, m - 2, 1))), au: iso(new Date(Date.UTC(a, m + 1, 0))) };
        case "annee":
            return { du: `${a}-01-01`, au: `${a}-12-31` };
        default:
            return {};
    }
};

export const moisCourant = (maintenant = new Date()) => maintenant.toISOString().slice(0, 7);
