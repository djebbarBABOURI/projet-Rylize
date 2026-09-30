import mongoose from "mongoose";
import { CATEGORIE_MAX, DESCRIPTION_MAX } from "../outils/validationDepense.js";

const depenseSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Utilisateur",
            required: true,
        },
        montant: {
            type: Number,
            required: true,
            min: [0.01, "Le montant doit être positif"],
        },
        // Les catégories sont désormais définies par l'utilisateur (plus d'enum figé)
        categorie: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: CATEGORIE_MAX,
        },
        date: {
            type: Date,
            required: true,
        },
        description: {
            type: String,
            required: false,
            trim: true,
            maxlength: DESCRIPTION_MAX,
            default: "",
        },
    },
    { timestamps: true }
);

// Index adaptés aux requêtes de l'application :
// - liste des dépenses d'un utilisateur triée par date
// - filtres / agrégations par catégorie sur une période
depenseSchema.index({ userId: 1, date: -1 });
depenseSchema.index({ userId: 1, categorie: 1, date: -1 });

const Depense = mongoose.model("Depense", depenseSchema);

export default Depense;
