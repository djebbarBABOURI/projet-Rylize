import express from "express";
import { connecter, deconnecter, inscrir } from "../controlleurs/authentification.controlleur.js";

const router = express.Router();

router.post("/inscription",inscrir);
router.post("/connexion",connecter);
router.post("/deconnexion",deconnecter);

export default router;