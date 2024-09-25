import Utilisateur from "../model/utilisateur.model.js";
import bcryptjs from "bcryptjs";
import genererToken_et_setcookie from "../outils/genererToken.js";
export const inscrir = async (req, res) => {
    try {
        // Extraction des informations du corps de la requête
        const { nom, prenom, email, mdp, confirm_mdp, adresse } = req.body;

        // Vérification si le mot de passe et la confirmation correspondent
        if (mdp !== confirm_mdp) {
            return res.status(400).json({ error: "Les mots de passe ne correspondent pas" });
        }

        // Recherche de l'utilisateur dans la base de données pour voir s'il existe déjà avec cet email
        const utilisateur = await Utilisateur.findOne({ email });
        if (utilisateur) {
            return res.status(400).json({ error: "L'utilisateur existe déjà !" });
        }

        // Génération d'un sel pour le hachage du mot de passe
        const salt = await bcryptjs.genSalt(15);

        // Hachage du mot de passe avec le sel généré
        const hash_mdp = await bcryptjs.hash(mdp, salt);

        // Création d'un nouvel utilisateur avec les informations fournies, en incluant le mot de passe haché
        const nv_utilisateur = new Utilisateur({
            nom,
            prenom,
            email,
            mdp: hash_mdp, // Enregistrement du mot de passe haché
            adresse
        });

        // Si l'utilisateur est correctement créé, générer un token et configurer le cookie
        if (nv_utilisateur) {
            genererToken_et_setcookie(nv_utilisateur._id, res); // Création et gestion du token pour l'authentification

            // Enregistrement de l'utilisateur dans la base de données
            await nv_utilisateur.save();

            // Réponse avec les informations de l'utilisateur nouvellement créé
            res.status(201).json({
                _id: nv_utilisateur._id,
                nom: nom,
                prenom: prenom,
                email: email,
                adresse: adresse,
                imgProfil: "",
            });
        }

    } catch (error) {
        // Gestion des erreurs et renvoi d'un message d'erreur au client en cas de problème serveur
        console.log("Erreur dans la méthode 'inscrir' ", error.message);
        res.status(500).json({ error: "Erreur interne de serveur" });
    }
};


export const connecter = async (req, res) => {
    try {
        const { email, mdp } = req.body;

        // Recherche de l'utilisateur dans la base de données
        const utilisateur = await Utilisateur.findOne({ email });

        // Vérification si l'utilisateur existe
        if (!utilisateur) {
            return res.status(400).json({ error: "Email ou mot de passe sont invalides" });
        }

        // Comparaison des mots de passe
        const mdpCorrect = await bcryptjs.compare(mdp, utilisateur.mdp);

        if (!mdpCorrect) {
            return res.status(400).json({ error: "Email ou mot de passe sont invalides" });
        }

        // Génération du token et configuration du cookie
        genererToken_et_setcookie(utilisateur._id, res);

        // Réponse avec les informations utilisateur
        res.status(200).json({
            _id: utilisateur._id,
            nom: utilisateur.nom,
            prenom: utilisateur.prenom,
            email: utilisateur.email,
            adresse: utilisateur.adresse,
            imgProfil: utilisateur.imgProfil,
        });

    } catch (error) {
        console.log("Erreur dans la méthode 'connecter' ", error.message);
        res.status(500).json({ error: "Erreur interne de serveur" });
    }
};


export const deconnecter = (req, res) => {
    try {
        // Suppression du cookie contenant le token JWT en le remplaçant par une chaîne vide et en définissant une durée d'expiration immédiate
        res.cookie("jwt", "", { maxAge: 0 });

        // Envoi d'une réponse avec un message de confirmation de la déconnexion
        res.status(200).json({ message: "Déconnexion faite avec succès" });

    } catch (error) {
        // Gestion des erreurs et envoi d'une réponse d'erreur en cas de problème serveur
        console.log("Erreur dans la méthode 'deconnecter' ", error.message);
        res.status(500).json({ error: "Erreur interne de serveur" });
    }
};
