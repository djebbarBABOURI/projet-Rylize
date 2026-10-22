import config from "./config/env.js";
import app from "./app.js";
import { connexionMongoDB, deconnexionMongoDB } from "./bdd/connexionMongoDb.js";

const demarrer = async () => {
    try {
        await connexionMongoDB();
    } catch (error) {
        console.error("Impossible de se connecter à MongoDB :", error.message);
        process.exit(1);
    }

    const serveur = app.listen(config.port, () => {
        console.log(`Serveur démarré sur le port ${config.port} (${config.env})`);
    });

    // Arrêt propre : on ferme le serveur HTTP puis la connexion MongoDB
    const arreter = async (signal) => {
        console.log(`${signal} reçu, arrêt en cours...`);
        serveur.close(async () => {
            await deconnexionMongoDB();
            process.exit(0);
        });
    };
    process.on("SIGINT", () => arreter("SIGINT"));
    process.on("SIGTERM", () => arreter("SIGTERM"));
};

demarrer();
