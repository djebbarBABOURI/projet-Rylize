// Aides de test : exécute de vrais pipelines MongoDB en mémoire grâce à mingo,
// sans avoir besoin d'un serveur MongoDB.
import { Aggregator, Query } from "mingo"; // l'entrée principale charge tous les opérateurs

export const agreger = (donnees, pipeline) => new Aggregator(pipeline).run(donnees);
export const trouver = (donnees, filtre) => new Query(filtre).find(donnees).all();

export const depense = (date, categorie, montant, description = "", userId = "u1") => ({
    userId,
    date: new Date(date),
    categorie,
    montant,
    description,
});

export const JEU = [
    depense("2026-09-10", "transport", 30),
    depense("2026-09-20", "nourriture", 70),
    depense("2026-10-02", "nourriture", 40.5, "Courses"),
    depense("2026-10-15", "loisirs", 25, "Cinéma"),
    depense("2026-10-28", "nourriture", 19.5),
    depense("2026-10-30", "transport", 60),
    depense("2026-11-03", "loisirs", 15),
    depense("2026-11-10", "nourriture", 50),
    depense("2026-10-05", "loisirs", 999, "autre utilisateur", "u2"),
];
