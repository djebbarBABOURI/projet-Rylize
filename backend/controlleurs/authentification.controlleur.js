import Utilisateur from "../model/utilisateur.model.js";
import bcryptjs from "bcryptjs";
import genererToken_et_setcookie from "../outils/genererToken.js";
export const inscrir=async (req, res)=>{
    try {
        const {nom, prenom, email, mdp, confirm_mdp, adresse} = req.body;
        console.log(req.body);
        if(mdp !== confirm_mdp){
            return res.status(400).json({error: "les mots de passe ne correspond pas"});
        }

        const utilisateur = await Utilisateur.findOne({email});
        if(utilisateur){
           return res.status(400).json({error:"l'utilisateur existe !"});
        }
        const salt = await bcryptjs.genSalt(15);
        const hash_mdp = await bcryptjs.hash(mdp,salt);
        const nv_utilisateur = new Utilisateur({
            nom,
            prenom,
            email,
            mdp:hash_mdp,
            adresse
        });
        
        if (nv_utilisateur) {
            genererToken_et_setcookie(nv_utilisateur._id, res);
            await nv_utilisateur.save();
            res.status(201).json({
                _id: nv_utilisateur._id,
                nom: nom,
                prenom: prenom,
                email: email,
                adresse: adresse
            });
        }

    } catch (error) {
        console.log("Erreur dans la méthode 'inscrir' ", error.message);
        res.status(500).json({error: "Erreur interne de serveur"});
    }
}

export const connecter=(req, res)=>{
    console.log("connecter");
}

export const deconnecter=(req, res)=>{
    console.log("déconnecter");
}