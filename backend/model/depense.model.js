import mongoose from "mongoose";

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
        },
        categorie: {
            type: String,
            required: true,
            enum: ["nourriture", "transport", "loisirs"],
        },
        date: {
            type: Date,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);

const Depense = mongoose.model("Depense", depenseSchema);

export default Depense;
