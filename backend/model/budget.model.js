import mongoose from "mongoose";

// Budget mensuel : global (categorie = null) ou limité à une catégorie
const budgetSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Utilisateur",
            required: true,
        },
        categorie: {
            type: String,
            default: null,
            trim: true,
            lowercase: true,
            maxlength: 50,
        },
        montant: {
            type: Number,
            required: true,
            min: [0.01, "Le budget doit être positif"],
        },
    },
    { timestamps: true }
);

// Un seul budget par catégorie (et un seul budget global) et par utilisateur
budgetSchema.index({ userId: 1, categorie: 1 }, { unique: true });

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;
