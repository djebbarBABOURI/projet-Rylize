import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api.js";

// Charge les catégories de l'utilisateur depuis MongoDB (via l'API)
export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const recharger = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.get("/api/categories");
            setCategories(data.categories);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        recharger();
    }, [recharger]);

    return { categories, loading, recharger };
};
