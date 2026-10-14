import mongoose from 'mongoose';
import Depense from '../model/depense.model.js';
import Categorie from '../model/categorie.model.js';
import { assurerCategoriesParDefaut } from '../services/categorie.service.js';
import { construireRequete } from '../services/depenseRequete.js';
import { versCsv } from '../outils/csv.js';
import { validerDepense } from '../outils/validationDepense.js';

// Vérifie que la catégorie existe bien dans celles de l'utilisateur
const categorieExiste = async (userId, nom) => {
    await assurerCategoriesParDefaut(userId);
    return Categorie.exists({ userId, nom });
};

export const ajoutDepense = async (req, res) => {
    try {
        const { valide, erreurs, valeurs } = validerDepense(req.body);
        if (!valide) {
            return res.status(400).json({ error: Object.values(erreurs)[0], erreurs });
        }
        if (!(await categorieExiste(req.utilisateur._id, valeurs.categorie))) {
            return res.status(400).json({ error: `La catégorie "${valeurs.categorie}" n'existe pas` });
        }
        const nvDepense = await Depense.create({ ...valeurs, userId: req.utilisateur._id });
        res.status(201).json({ message: "Dépense ajoutée avec succès", depense: nvDepense });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const modifierDepense = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: "Identifiant de dépense invalide" });
        }
        const { valide, erreurs, valeurs } = validerDepense(req.body);
        if (!valide) {
            return res.status(400).json({ error: Object.values(erreurs)[0], erreurs });
        }

        if (!(await categorieExiste(req.utilisateur._id, valeurs.categorie))) {
            return res.status(400).json({ error: `La catégorie "${valeurs.categorie}" n'existe pas` });
        }

        // Le filtre sur userId garantit qu'on ne modifie que ses propres dépenses
        const depenseModifiee = await Depense.findOneAndUpdate(
            { _id: id, userId: req.utilisateur._id },
            { $set: valeurs },
            { new: true, runValidators: true }
        );
        if (!depenseModifiee) {
            return res.status(404).json({ error: "Dépense non trouvée" });
        }
        res.status(200).json({ message: "Dépense modifiée avec succès", depense: depenseModifiee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getDepensesUtilisateur = async (req, res) => {
    try {
        const { erreur, filtre, tri, pagination } = construireRequete(req.utilisateur._id, req.query);
        if (erreur) return res.status(400).json({ error: erreur });

        // Sans paramètre "limite", toute la liste est renvoyée (comportement historique)
        if (!pagination) {
            const depenses = await Depense.find(filtre).sort(tri);
            return res.status(200).json({ depenses });
        }

        const [depenses, total] = await Promise.all([
            Depense.find(filtre).sort(tri).skip(pagination.skip).limit(pagination.limite),
            Depense.countDocuments(filtre),
        ]);
        res.status(200).json({
            depenses,
            pagination: {
                page: pagination.page,
                limite: pagination.limite,
                total,
                pages: Math.max(Math.ceil(total / pagination.limite), 1),
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteDepenses = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0 || !ids.every((id) => mongoose.isValidObjectId(id))) {
            return res.status(400).json({ error: "Liste d'identifiants invalide" });
        }
        // Seules les dépenses de l'utilisateur connecté peuvent être supprimées
        const resultat = await Depense.deleteMany({ _id: { $in: ids }, userId: req.utilisateur._id });
        res.status(200).json({
            message: "Dépenses supprimées avec succès !",
            supprimees: resultat.deletedCount,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Export CSV des dépenses (mêmes filtres que la liste : categorie, du, au, min, max, q, tri...)
export const exporterDepenses = async (req, res) => {
    try {
        const { erreur, filtre, tri } = construireRequete(req.utilisateur._id, req.query);
        if (erreur) return res.status(400).json({ error: erreur });

        const depenses = await Depense.find(filtre).sort(tri).limit(50000).lean();
        const nomFichier = `depenses-${new Date().toISOString().slice(0, 10)}.csv`;

        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="${nomFichier}"`);
        res.status(200).send(versCsv(depenses));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
