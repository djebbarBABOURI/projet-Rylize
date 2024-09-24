import jsonwebtoken from "jsonwebtoken";
import Utilisateur from "../model/utilisateur.model.js";

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        console.log("tokkk : ", token);
        if (!token) {
            return res.status(401).json({ error: "Non autorisé - Aucun jeton fourni" });
        }

        const decoder = jsonwebtoken.verify(token, process.env.JWT_SECRET);

        if (!decoder) {
            return res.status(401).json({ error: "Non autorisé - Jeton invalide" });
        }
        console.log("decoder.id_utilisateur : ", decoder);
        const utilisateur = await Utilisateur.findById(decoder.id_utilisateur).select("-mdp");
        console.log("utilisateur : ", utilisateur);
        if (!utilisateur) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }


        req.utilisateur = utilisateur;

        next();
    } catch (error) {
        console.log("Erreur dans le middleware protectRoute :", error.message);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

export default protectRoute;
