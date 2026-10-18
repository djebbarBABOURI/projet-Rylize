import { bornesMois, lirePeriode } from "../outils/periode.js";
import { calculerResumeMensuel, calculerStatistiques } from "../services/statistiques.service.js";

export const getStatistiques = async (req, res) => {
    try {
        const periode = lirePeriode(req.query);
        if (periode.erreur) return res.status(400).json({ error: periode.erreur });

        const statistiques = await calculerStatistiques(req.utilisateur._id, periode);
        res.status(200).json({ statistiques });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getResumeMensuel = async (req, res) => {
    try {
        const bornes = bornesMois(req.query.mois);
        if (bornes.erreur) return res.status(400).json({ error: bornes.erreur });

        const resume = await calculerResumeMensuel(req.utilisateur._id, bornes);
        res.status(200).json({ resume });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
