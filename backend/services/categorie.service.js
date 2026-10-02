import Categorie from "../model/categorie.model.js";

export const CATEGORIES_PAR_DEFAUT = [
    { nom: "nourriture", couleur: "#f97316" },
    { nom: "transport", couleur: "#3b82f6" },
    { nom: "loisirs", couleur: "#a855f7" },
    { nom: "logement", couleur: "#14b8a6" },
    { nom: "santé", couleur: "#ef4444" },
    { nom: "autres", couleur: "#6b7280" },
];

// Crée les catégories par défaut si l'utilisateur n'en possède encore aucune.
// Appelée à l'inscription et "à la volée" pour les comptes créés avant cette fonctionnalité.
export const assurerCategoriesParDefaut = async (userId) => {
    if (await Categorie.exists({ userId })) return;
    try {
        await Categorie.insertMany(
            CATEGORIES_PAR_DEFAUT.map((c) => ({ ...c, userId })),
            { ordered: false }
        );
    } catch (error) {
        // Deux requêtes simultanées : l'index unique protège des doublons, on ignore ce cas
        if (error.code !== 11000 && !error.writeErrors?.every((e) => e.err?.code === 11000)) throw error;
    }
};
