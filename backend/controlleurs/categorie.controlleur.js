import mongoose from "mongoose";
import Categorie from "../model/categorie.model.js";
import Budget from "../model/budget.model.js";
import Depense from "../model/depense.model.js";
import { assurerCategoriesParDefaut } from "../services/categorie.service.js";

export const getCategories = async (req, res) => {
    try {
        await assurerCategoriesParDefaut(req.utilisateur._id);
        const categories = await Categorie.find({ userId: req.utilisateur._id }).sort({ nom: 1 });
        res.status(200).json({ categories });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const ajoutCategorie = async (req, res) => {
    try {
        const { nom, couleur } = req.body;
        if (typeof nom !== "string" || !nom.trim()) {
            return res.status(400).json({ error: "Le nom de la catégorie est obligatoire" });
        }
        const categorie = await Categorie.create({ userId: req.utilisateur._id, nom, couleur });
        res.status(201).json({ message: "Catégorie ajoutée", categorie });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ error: "Cette catégorie existe déjà" });
        if (error.name === "ValidationError") return res.status(400).json({ error: error.message });
        res.status(500).json({ error: error.message });
    }
};

export const modifierCategorie = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Identifiant invalide" });

        const categorie = await Categorie.findOne({ _id: id, userId: req.utilisateur._id });
        if (!categorie) return res.status(404).json({ error: "Catégorie non trouvée" });

        const ancienNom = categorie.nom;
        if (req.body.nom !== undefined) categorie.nom = req.body.nom;
        if (req.body.couleur !== undefined) categorie.couleur = req.body.couleur;
        await categorie.save();

        // Renommer une catégorie met à jour les dépenses associées
        if (categorie.nom !== ancienNom) {
            await Depense.updateMany(
                { userId: req.utilisateur._id, categorie: ancienNom },
                { $set: { categorie: categorie.nom } }
            );
            await Budget.updateMany(
                { userId: req.utilisateur._id, categorie: ancienNom },
                { $set: { categorie: categorie.nom } }
            );
        }
        res.status(200).json({ message: "Catégorie modifiée", categorie });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ error: "Cette catégorie existe déjà" });
        if (error.name === "ValidationError") return res.status(400).json({ error: error.message });
        res.status(500).json({ error: error.message });
    }
};

export const supprimerCategorie = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Identifiant invalide" });

        const categorie = await Categorie.findOne({ _id: id, userId: req.utilisateur._id });
        if (!categorie) return res.status(404).json({ error: "Catégorie non trouvée" });

        const nbDepenses = await Depense.countDocuments({ userId: req.utilisateur._id, categorie: categorie.nom });
        if (nbDepenses > 0) {
            return res.status(409).json({
                error: `Impossible de supprimer : ${nbDepenses} dépense(s) utilisent cette catégorie`,
            });
        }
        await categorie.deleteOne();
        await Budget.deleteMany({ userId: req.utilisateur._id, categorie: categorie.nom });
        res.status(200).json({ message: "Catégorie supprimée" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
