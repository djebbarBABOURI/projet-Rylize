import express from "express";
import { dbEstConnectee } from "../bdd/connexionMongoDb.js";

const router = express.Router();

// Utilisé par Docker / les load balancers pour savoir si l'API est opérationnelle
router.get("/", (req, res) => {
    const db = dbEstConnectee();
    res.status(db ? 200 : 503).json({
        statut: db ? "ok" : "indisponible",
        mongodb: db ? "connecte" : "deconnecte",
        uptime: Math.round(process.uptime()),
    });
});

export default router;
