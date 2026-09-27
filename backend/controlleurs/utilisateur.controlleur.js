import bcryptjs from "bcryptjs";
import Utilisateur from "../model/utilisateur.model.js";
import { verifierNouveauMdp } from "../outils/validationMdp.js";

// Seuls ces champs sont modifiables depuis le profil (évite l'assignation de masse, ex. changer "mdp")
const CHAMPS_MODIFIABLES = ["nom", "prenom", "email", "adresse", "imgProfil"];

export const modifUtilisateur = async (req, res) => {
    try {
        // Un utilisateur ne peut modifier que son propre profil
        if (req.params.id !== req.utilisateur.id) {
            return res.status(403).json({ error: "Vous ne pouvez modifier que votre propre profil" });
        }

        const modifications = {};
        for (const champ of CHAMPS_MODIFIABLES) {
            if (req.body[champ] !== undefined) modifications[champ] = req.body[champ];
        }

        const utilisateur = await Utilisateur.findByIdAndUpdate(req.utilisateur._id, modifications, {
            new: true,
            runValidators: true,
        }).select("-mdp");

        if (!utilisateur) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        res.status(200).json(utilisateur);
    } catch (error) {
        // 11000 = violation de l'index unique sur l'email
        if (error.code === 11000) {
            return res.status(409).json({ error: "Cet email est déjà utilisé" });
        }
        console.log("Erreur dans modifUtilisateur controlleur: ", error.message);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

export const changerMotDePasse = async (req, res) => {
    try {
        const { ancienMdp, nouveauMdp, confirmation } = req.body;

        if (nouveauMdp !== confirmation) {
            return res.status(400).json({ error: "Les mots de passe ne correspondent pas" });
        }
        const erreur = verifierNouveauMdp(nouveauMdp);
        if (erreur) return res.status(400).json({ error: erreur });

        // protectRoute n'a pas chargé le hash du mot de passe : on le relit ici
        const utilisateur = await Utilisateur.findById(req.utilisateur._id);
        const correct = typeof ancienMdp === "string" && await bcryptjs.compare(ancienMdp, utilisateur.mdp);
        if (!correct) {
            return res.status(400).json({ error: "L'ancien mot de passe est incorrect" });
        }

        utilisateur.mdp = await bcryptjs.hash(nouveauMdp, 12);
        await utilisateur.save();
        res.status(200).json({ message: "Mot de passe modifié avec succès" });
    } catch (error) {
        console.log("Erreur dans changerMotDePasse : ", error.message);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

export default modifUtilisateur;
