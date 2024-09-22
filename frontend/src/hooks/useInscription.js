import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/UtilisateurAuthContext";
const useInscription = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUtilisateur } = useAuthContext();
    const inscription = async ({ nom, prenom, email, mdp, confirm_mdp, adresse }) => {
        const success = handleInputErrors({ nom, prenom, email, mdp, confirm_mdp, adresse });
        if (!success) return;

        setLoading(true);
        try {
            const res = await fetch("/api/authautification/inscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nom, prenom, email, mdp, confirm_mdp, adresse }),
            });
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }

            localStorage.setItem("Auth-Utilisateur", JSON.stringify(data));
            setAuthUtilisateur(data);

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, inscription };
};
export default useInscription;

function handleInputErrors({ nom, prenom, email, mdp, confirm_mdp, adresse }) {
    if (!nom || !prenom || !email || !mdp || !confirm_mdp || !adresse) {
        toast.error("Vous devez remplir tout les champs du formulaire !");
        return false;
    }

    if (mdp !== confirm_mdp) {
        toast.error("Les mots de passe ne corresspond pas !");
        return false;
    }

    if (mdp.length < 8) {
        toast.error("La longueur de mot de passe doit etre au minimum de 8 caractère.");
        return false;
    }

    return true;
}