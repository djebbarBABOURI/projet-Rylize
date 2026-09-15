import dotenv from "dotenv";

dotenv.config();

const variablesRequises = ["MONGO_DB_URI", "JWT_SECRET"];
const manquantes = variablesRequises.filter((nom) => !process.env[nom]);

if (manquantes.length > 0) {
    console.error(
        `Variables d'environnement manquantes : ${manquantes.join(", ")}.\n` +
        "Copiez .env.example vers .env puis renseignez les valeurs."
    );
    process.exit(1);
}

const env = process.env.NODE_ENV || "development";

export const config = {
    port: Number(process.env.PORT) || 8000,
    mongoUri: process.env.MONGO_DB_URI,
    jwtSecret: process.env.JWT_SECRET,
    env,
    // Les cookies "secure" ne sont activés qu'en production (HTTPS)
    isProd: env === "production",
};

export default config;
