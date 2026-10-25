// Génération déterministe de dépenses de démonstration (même résultat à chaque exécution)

const MODELES = {
    nourriture: { min: 4, max: 85, poids: 10, descriptions: ["Courses", "Restaurant", "Boulangerie", "Marché", "Livraison repas"] },
    transport: { min: 2, max: 70, poids: 5, descriptions: ["Pass Navigo", "Essence", "Train", "Covoiturage", "Parking"] },
    loisirs: { min: 8, max: 60, poids: 4, descriptions: ["Cinéma", "Concert", "Abonnement streaming", "Jeu vidéo", "Sortie entre amis"] },
    logement: { min: 40, max: 650, poids: 1, descriptions: ["Loyer", "Électricité", "Internet", "Assurance habitation"] },
    "santé": { min: 6, max: 60, poids: 1, descriptions: ["Pharmacie", "Médecin", "Mutuelle"] },
    autres: { min: 5, max: 90, poids: 2, descriptions: ["Cadeau", "Vêtements", "Papeterie", ""] },
};

// Petit générateur pseudo-aléatoire (mulberry32)
const creerAlea = (graine) => () => {
    graine |= 0;
    graine = (graine + 0x6d2b79f5) | 0;
    let t = Math.imul(graine ^ (graine >>> 15), 1 | graine);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const genererDepensesDemo = (userId, maintenant = new Date(), nbMois = 4) => {
    const alea = creerAlea(2026);
    const depenses = [];
    const categories = Object.keys(MODELES);
    const total = categories.reduce((s, c) => s + MODELES[c].poids, 0);
    const choisirCategorie = () => {
        let tirage = alea() * total;
        for (const c of categories) {
            tirage -= MODELES[c].poids;
            if (tirage <= 0) return c;
        }
        return "autres";
    };

    const debut = Date.UTC(maintenant.getUTCFullYear(), maintenant.getUTCMonth() - (nbMois - 1), 1);
    const aujourdhui = Date.UTC(maintenant.getUTCFullYear(), maintenant.getUTCMonth(), maintenant.getUTCDate());

    for (let jour = debut; jour <= aujourdhui; jour += 86400000) {
        const date = new Date(jour);
        // Loyer le 1er de chaque mois
        if (date.getUTCDate() === 1) {
            depenses.push({ userId, date, categorie: "logement", montant: 620, description: "Loyer" });
        }
        // 0 à 2 dépenses par jour
        const nb = Math.floor(alea() * 2.4);
        for (let i = 0; i < nb; i++) {
            const categorie = choisirCategorie();
            const m = MODELES[categorie];
            const montant = Math.round((m.min + alea() * (m.max - m.min)) * 100) / 100;
            const description = m.descriptions[Math.floor(alea() * m.descriptions.length)];
            depenses.push({ userId, date, categorie, montant, description });
        }
    }
    return depenses;
};

export const BUDGETS_DEMO = [
    { categorie: null, montant: 1400 },
    { categorie: "nourriture", montant: 350 },
    { categorie: "transport", montant: 120 },
    { categorie: "loisirs", montant: 100 },
];
