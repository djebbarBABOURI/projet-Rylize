import { useEffect, useState } from "react";
import { api, construireQuery } from "../services/api.js";

// Charge la prévision du mois et les dépenses inhabituelles de la période.
// `disponible` passe à false si le service ML n'est pas installé ou ne répond pas : l'interface se masque alors.
export const useInsightsML = (bornes, version) => {
    const [etat, setEtat] = useState({ chargement: true, disponible: true, prevision: null, anomalies: null });

    useEffect(() => {
        let annule = false;
        setEtat((e) => ({ ...e, chargement: true }));
        Promise.all([
            api.get("/api/ml/prevision"),
            api.get(`/api/ml/anomalies${construireQuery(bornes)}`),
        ])
            .then(([p, a]) => {
                if (!annule) setEtat({ chargement: false, disponible: true, prevision: p.prevision, anomalies: a.resultat });
            })
            .catch(() => {
                if (!annule) setEtat({ chargement: false, disponible: false, prevision: null, anomalies: null });
            });
        return () => {
            annule = true;
        };
    }, [bornes, version]);

    return etat;
};
