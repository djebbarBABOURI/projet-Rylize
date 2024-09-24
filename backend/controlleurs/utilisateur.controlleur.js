import Utilisateur from "../model/utilisateur.model.js";
export const modifUtilisateur = async (req, res) => {
    try {
        const { nom, prenom, email, adresse } = req.body;
        const id_utilisateur = req.params.id;
        const utilisateurId = req.utilisateur.id_utilisateur;

        console.log(id_utilisateur, utilisateurId);

        const updatedUtilisateur = await Utilisateur.findByIdAndUpdate(id_utilisateur, req.body, {
            new: true,
            runValidators: true
        });

        if (!updatedUtilisateur) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.status(201).json(updatedUtilisateur);
        // await conversation.save();
        // await newMessage.save();

        // this will run in parallel
        //	await Promise.all([conversation.save(), newMessage.save()]);
    } catch (error) {
        console.log("Erreur dans modifUtilisateur controlleur: ", error.message);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};
export default modifUtilisateur;
