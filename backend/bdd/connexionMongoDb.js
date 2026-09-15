import mongoose from "mongoose";
import config from "../config/env.js";

mongoose.connection.on("disconnected", () => console.warn("MongoDB : connexion perdue"));
mongoose.connection.on("reconnected", () => console.log("MongoDB : reconnecté"));
mongoose.connection.on("error", (err) => console.error("MongoDB : erreur", err.message));

export const connexionMongoDB = async () => {
    // Les options useNewUrlParser / useUnifiedTopology sont obsolètes depuis le driver 4
    await mongoose.connect(config.mongoUri, {
        serverSelectionTimeoutMS: 10000,
    });
    console.log(`Connexion à MongoDB réussie (base "${mongoose.connection.name}")`);
};

export const deconnexionMongoDB = async () => {
    await mongoose.connection.close();
};

// 0 = déconnecté, 1 = connecté, 2 = en cours de connexion, 3 = en cours de déconnexion
export const dbEstConnectee = () => mongoose.connection.readyState === 1;

export default connexionMongoDB;
