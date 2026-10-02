import mongoose from "mongoose";

const categorieSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Utilisateur",
            required: true,
        },
        nom: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 50,
        },
        // Couleur utilisée dans les graphiques et les badges
        couleur: {
            type: String,
            default: "#3b82f6",
            match: [/^#[0-9a-f]{6}$/i, "La couleur doit être au format #RRGGBB"],
        },
    },
    { timestamps: true }
);

// Un utilisateur ne peut pas avoir deux catégories portant le même nom
categorieSchema.index({ userId: 1, nom: 1 }, { unique: true });

const Categorie = mongoose.model("Categorie", categorieSchema);

export default Categorie;
