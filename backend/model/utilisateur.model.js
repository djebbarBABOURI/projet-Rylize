import mongoose from "mongoose";
const utilisateurSchema = new mongoose.Schema({
    nom:{
        type: String,
        required: true
    },
    prenom:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    mdp:{
        type: String,
        required: true,
    },
    adresse:{
        type: String,
        required: true
    },
    imgProfil:{
        type: String,
        default: "",
    },
});
const utilisateur = mongoose.model("Utilisateur",utilisateurSchema);
export default utilisateur;