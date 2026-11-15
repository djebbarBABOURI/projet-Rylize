import { bornesMois } from "../outils/periode.js";
import { appelerML, ErreurML, mlConfigure } from "../services/ml.service.js";

const REGEX_DATE = /^\d{4}-\d{2}-\d{2}$/;
const dateValide = (texte) => REGEX_DATE.test(texte) && !Number.isNaN(new Date(texte).getTime());

// Transforme une ErreurML en réponse HTTP ; "disponible: false" permet au frontend de masquer la fonctionnalité
const repondreErreur = (res, error) => {
    if (error instanceof ErreurML) {
        return res.status(error.statut).json({ error: error.message, disponible: false });
    }
    console.error("Erreur ML :", error.message);
    return res.status(500).json({ error: "Erreur interne du serveur" });
};

export const getStatutML = async (req, res) => {
    if (!mlConfigure()) return res.status(200).json({ disponible: false });
    try {
        await appelerML("/sante");
        res.status(200).json({ disponible: true });
    } catch {
        res.status(200).json({ disponible: false });
    }
};

// GET /api/ml/categorie?description=...
export const suggererCategorie = async (req, res) => {
    const description = typeof req.query.description === "string" ? req.query.description.trim() : "";
    if (description.length < 2 || description.length > 200) {
        return res.status(400).json({ error: "La description doit contenir entre 2 et 200 caractères" });
    }
    try {
        // L'identifiant vient de la session : un utilisateur ne peut pas interroger le modèle d'un autre
        const data = await appelerML("/categorie/suggestion", {
            method: "POST",
            body: { userId: req.utilisateur.id, description },
        });
        res.status(200).json(data);
    } catch (error) {
        repondreErreur(res, error);
    }
};

// GET /api/ml/prevision?mois=AAAA-MM  (mois courant par défaut)
export const getPrevision = async (req, res) => {
    const bornes = bornesMois(req.query.mois);
    if (bornes.erreur) return res.status(400).json({ error: bornes.erreur });
    try {
        const data = await appelerML(`/prevision/${req.utilisateur.id}?mois=${bornes.cle}`);
        res.status(200).json({ prevision: data });
    } catch (error) {
        repondreErreur(res, error);
    }
};

// GET /api/ml/anomalies?du=AAAA-MM-JJ&au=AAAA-MM-JJ
export const getAnomalies = async (req, res) => {
    const { du, au } = req.query;
    for (const [nom, valeur] of [["du", du], ["au", au]]) {
        if (valeur !== undefined && !dateValide(valeur)) {
            return res.status(400).json({ error: `Le paramètre '${nom}' doit être une date AAAA-MM-JJ` });
        }
    }
    const params = new URLSearchParams();
    if (du) params.set("du", du);
    if (au) params.set("au", au);
    try {
        const data = await appelerML(`/anomalies/${req.utilisateur.id}${params.size ? `?${params}` : ""}`);
        res.status(200).json({ resultat: data });
    } catch (error) {
        repondreErreur(res, error);
    }
};
