import { useState } from "react";
import { useAuthContext } from "../context/UtilisateurAuthContext";
import toast from "react-hot-toast";

const useLogout = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUtilisateur } = useAuthContext();

    const deconnecter = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/authautification/deconnexion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }

            localStorage.removeItem("Auth-Utilisateur");
            setAuthUtilisateur(null);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, deconnecter };
};
export default useLogout;
