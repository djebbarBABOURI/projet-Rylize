import config from "../config/env.js";

const DELAI_MS = 8000;

// Erreur portant le code HTTP à renvoyer au client
export class ErreurML extends Error {
    constructor(message, statut) {
        super(message);
        this.statut = statut;
    }
}

export const mlConfigure = () => Boolean(config.mlUrl);

// Appelle le service Python. Toute défaillance devient une ErreurML (jamais de détails internes au client).
export const appelerML = async (chemin, { method = "GET", body } = {}) => {
    if (!mlConfigure()) throw new ErreurML("Le service de machine learning n'est pas configuré", 503);

    const controleur = new AbortController();
    const minuteur = setTimeout(() => controleur.abort(), DELAI_MS);
    try {
        const res = await fetch(config.mlUrl + chemin, {
            method,
            headers: { "Content-Type": "application/json", "X-ML-Token": config.mlToken },
            body: body === undefined ? undefined : JSON.stringify(body),
            signal: controleur.signal,
        });
        if (!res.ok) {
            console.error(`Service ML : ${method} ${chemin} -> ${res.status}`);
            throw new ErreurML("Le service de machine learning a renvoyé une erreur", res.status >= 500 ? 503 : 502);
        }
        return await res.json();
    } catch (error) {
        if (error instanceof ErreurML) throw error;
        console.error("Service ML injoignable :", error.name === "AbortError" ? "délai dépassé" : error.message);
        throw new ErreurML("Le service de machine learning est indisponible", 503);
    } finally {
        clearTimeout(minuteur);
    }
};
