import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authautification.routes.js";
import utilisateurRoutes from "./routes/utilisateurRoutes.js";
import connexionMongoDB from "./bdd/connexionMongoDb.js";
import cookieParser from 'cookie-parser';
import depenseRoutes from './routes/depense.routes.js';
const app = express();
dotenv.config();
const port = process.env.PORT || 5000;

//pour permettre d'extraire les données depuis req.body
app.use(express.json());
app.use(cookieParser());

app.use("/api/authautification/", authRoutes);
app.use("/api/utilisateur/", utilisateurRoutes);
app.use("/api/depenses/", depenseRoutes);
app.listen(port, () => {
    connexionMongoDB();
    console.log(`server running on port ${port}`);
});