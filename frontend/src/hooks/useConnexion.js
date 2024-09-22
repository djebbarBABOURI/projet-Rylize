import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/UtilisateurAuthContext";

const useConnexion = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUtilisateur } = useAuthContext();

    const connexion = async (email, mdp) => {
        const success = handleInputErrors(email, mdp);
        if (!success) return;
        setLoading(true);
        try {
            const res = await fetch("/api/authautification/connexion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, mdp }),
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

    return { loading, connexion };
};
export default useConnexion;

function handleInputErrors(email, mdp) {
    if (!email || !mdp) {
        toast.error("Veuillez remplir tout les champs ! ");
        return false;
    }

    return true;
}
