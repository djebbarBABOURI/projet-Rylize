import Depense from "../model/depense.model.js";
import { arrondir } from "../outils/periode.js";

// Un seul aller-retour vers MongoDB : $facet exécute plusieurs agrégations
// en parallèle sur les mêmes documents filtrés.
export const construirePipelineStats = (userId, { du, au } = {}) => {
    const match = { userId };
    if (du || au) {
        match.date = {};
        if (du) match.date.$gte = du;
        if (au) match.date.$lte = au;
    }
    return [
        { $match: match },
        {
            $facet: {
                global: [
                    {
                        $group: {
                            _id: null,
                            total: { $sum: "$montant" },
                            nombre: { $sum: 1 },
                            moyenne: { $avg: "$montant" },
                            max: { $max: "$montant" },
                        },
                    },
                ],
                parCategorie: [
                    { $group: { _id: "$categorie", total: { $sum: "$montant" }, nombre: { $sum: 1 } } },
                    { $sort: { total: -1, _id: 1 } },
                ],
                parMois: [
                    {
                        $group: {
                            _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
                            total: { $sum: "$montant" },
                            nombre: { $sum: 1 },
                        },
                    },
                    { $sort: { _id: 1 } },
                ],
            },
        },
    ];
};

// Transforme la sortie brute de $facet en objet prêt pour l'API
export const formaterStats = (resultat = {}) => {
    const global = resultat.global?.[0] || { total: 0, nombre: 0, moyenne: 0, max: 0 };
    const total = global.total || 0;
    return {
        total: arrondir(total),
        nombre: global.nombre || 0,
        moyenne: arrondir(global.moyenne || 0),
        max: arrondir(global.max || 0),
        parCategorie: (resultat.parCategorie || []).map((c) => ({
            categorie: c._id,
            total: arrondir(c.total),
            nombre: c.nombre,
            part: total > 0 ? Math.round((c.total / total) * 1000) / 10 : 0,
        })),
        parMois: (resultat.parMois || []).map((m) => ({
            mois: m._id,
            total: arrondir(m.total),
            nombre: m.nombre,
        })),
    };
};

export const calculerStatistiques = async (userId, periode) => {
    const [resultat] = await Depense.aggregate(construirePipelineStats(userId, periode));
    return formaterStats(resultat);
};

// ---------------------------------------------------------------------------
// Résumé mensuel : mois choisi comparé au mois précédent
// ---------------------------------------------------------------------------

export const construirePipelineResume = (userId, bornes) => [
    // On ne lit que les deux mois utiles (l'index {userId, date} est exploité)
    { $match: { userId, date: { $gte: bornes.debutPrecedent, $lt: bornes.fin } } },
    {
        $facet: {
            courant: [
                { $match: { date: { $gte: bornes.debut } } },
                { $group: { _id: "$categorie", total: { $sum: "$montant" }, nombre: { $sum: 1 } } },
                { $sort: { total: -1, _id: 1 } },
            ],
            precedent: [
                { $match: { date: { $lt: bornes.debut } } },
                { $group: { _id: null, total: { $sum: "$montant" } } },
            ],
        },
    },
];

export const formaterResume = (resultat = {}, bornes, maintenant = new Date()) => {
    const courant = resultat.courant || [];
    const total = courant.reduce((somme, c) => somme + c.total, 0);
    const nombre = courant.reduce((somme, c) => somme + c.nombre, 0);
    const totalPrecedent = resultat.precedent?.[0]?.total || 0;

    // Pour le mois en cours, la moyenne se calcule sur les jours écoulés
    const enCours = maintenant >= bornes.debut && maintenant < bornes.fin;
    const joursEcoules = enCours ? maintenant.getUTCDate() : bornes.jours;

    return {
        mois: bornes.cle,
        total: arrondir(total),
        nombre,
        totalPrecedent: arrondir(totalPrecedent),
        // null si le mois précédent n'a aucune dépense (variation non définie)
        variation: totalPrecedent > 0 ? Math.round(((total - totalPrecedent) / totalPrecedent) * 1000) / 10 : null,
        moyenneJournaliere: arrondir(total / joursEcoules),
        // Estimation du total à la fin du mois, uniquement pour le mois en cours
        projection: enCours ? arrondir((total / joursEcoules) * bornes.jours) : null,
        categorieTop: courant.length > 0 ? { categorie: courant[0]._id, total: arrondir(courant[0].total) } : null,
    };
};

export const calculerResumeMensuel = async (userId, bornes) => {
    const [resultat] = await Depense.aggregate(construirePipelineResume(userId, bornes));
    return formaterResume(resultat, bornes);
};
