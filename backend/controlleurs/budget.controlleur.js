import mongoose from "mongoose";
import Budget from "../model/budget.model.js";
import Categorie from "../model/categorie.model.js";
import { bornesMois } from "../outils/periode.js";
import { lireBudgetsAvecStatut } from "../services/budget.service.js";

export const getBudgets = async (req, res) => {
    try {
        const bornes = bornesMois(req.query.mois);
        if (bornes.erreur) return res.status(400).json({ error: bornes.erreur });

        const budgets = await lireBudgetsAvecStatut(req.utilisateur._id, bornes);
        res.status(200).json({ mois: bornes.cle, budgets });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crée ou remplace le budget d'une catégorie (ou le budget global si categorie est vide)
export const definirBudget = async (req, res) => {
    try {
        const montant = Number(String(req.body.montant ?? "").replace(",", "."));
        if (!Number.isFinite(montant) || montant <= 0) {
            return res.status(400).json({ error: "Le budget doit être un nombre positif" });
        }
        const categorie = typeof req.body.categorie === "string" && req.body.categorie.trim()
            ? req.body.categorie.trim().toLowerCase()
            : null;

        if (categorie && !(await Categorie.exists({ userId: req.utilisateur._id, nom: categorie }))) {
            return res.status(400).json({ error: `La catégorie "${categorie}" n'existe pas` });
        }

        const budget = await Budget.findOneAndUpdate(
            { userId: req.utilisateur._id, categorie },
            { $set: { montant: Math.round(montant * 100) / 100 } },
            { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
        );
        res.status(200).json({ message: "Budget enregistré", budget });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const supprimerBudget = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Identifiant invalide" });

        const budget = await Budget.findOneAndDelete({ _id: id, userId: req.utilisateur._id });
        if (!budget) return res.status(404).json({ error: "Budget non trouvé" });
        res.status(200).json({ message: "Budget supprimé" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
