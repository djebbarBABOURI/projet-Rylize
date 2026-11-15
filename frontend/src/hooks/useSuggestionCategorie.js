import { useEffect, useState } from "react";
import { api, construireQuery } from "../services/api.js";

const DELAI_MS = 400;
const MIN_CARACTERES = 3;

// Suggère des catégories (modèle de machine learning) pendant la saisie de la description.
// Silencieux : si le service ML est absent ou en panne, la liste reste simplement vide.
export const useSuggestionCategorie = (description, actif = true) => {
    const [suggestions, setSuggestions] = useState([]);
    const [source, setSource] = useState(null);

    useEffect(() => {
        const texte = (description || "").trim();
        if (!actif || texte.length < MIN_CARACTERES) {
            setSuggestions([]);
            return undefined;
        }

        let annule = false;
        const minuteur = setTimeout(async () => {
            try {
                const data = await api.get(`/api/ml/categorie${construireQuery({ description: texte })}`);
                if (!annule) {
                    setSuggestions(data.suggestions ?? []);
                    setSource(data.source ?? null);
                }
            } catch {
                if (!annule) setSuggestions([]);
            }
        }, DELAI_MS);

        // Anti-rebond : une frappe suivante annule la requête en attente et ignore sa réponse
        return () => {
            annule = true;
            clearTimeout(minuteur);
        };
    }, [description, actif]);

    return { suggestions, source };
};
