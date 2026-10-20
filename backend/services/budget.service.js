import Depense from "../model/depense.model.js";
import Budget from "../model/budget.model.js";
import { arrondir } from "../outils/periode.js";

export const SEUIL_ATTENTION = 80; // % du budget à partir duquel on prévient l'utilisateur

// Compare une dépense cumulée à un budget (fonction pure)
export const calculerStatutBudget = (montantBudget, depense) => {
    const pourcentage = montantBudget > 0 ? Math.round((depense / montantBudget) * 1000) / 10 : 0;
    let statut = "ok";
    if (depense > montantBudget) statut = "depasse";
    else if (pourcentage >= SEUIL_ATTENTION) statut = "attention";
    return {
        depense: arrondir(depense),
        reste: arrondir(montantBudget - depense),
        pourcentage,
        statut,
    };
};

export const construirePipelineTotauxMois = (userId, bornes) => [
    { $match: { userId, date: { $gte: bornes.debut, $lt: bornes.fin } } },
    { $group: { _id: "$categorie", total: { $sum: "$montant" } } },
];

// Associe chaque budget au total dépensé sur le mois
export const associerBudgetsEtTotaux = (budgets, totaux) => {
    const parCategorie = new Map(totaux.map((t) => [t._id, t.total]));
    const totalGeneral = totaux.reduce((somme, t) => somme + t.total, 0);
    return budgets
        .map((b) => {
            const depense = b.categorie === null ? totalGeneral : parCategorie.get(b.categorie) || 0;
            return {
                _id: b._id,
                categorie: b.categorie,
                montant: b.montant,
                ...calculerStatutBudget(b.montant, depense),
            };
        })
        // Le budget global en premier, puis les catégories par ordre alphabétique
        .sort((a, b) => (a.categorie === null ? -1 : b.categorie === null ? 1 : a.categorie.localeCompare(b.categorie)));
};

export const lireBudgetsAvecStatut = async (userId, bornes) => {
    const [budgets, totaux] = await Promise.all([
        Budget.find({ userId }).lean(),
        Depense.aggregate(construirePipelineTotauxMois(userId, bornes)),
    ]);
    return associerBudgetsEtTotaux(budgets, totaux);
};
