import express from "express";
import { connecter, deconnecter, inscrir } from "../controlleurs/authentification.controlleur.js";

const router = express.Router();

router.post("/inscription",inscrir);
router.get("/connection",connecter);
router.get("/deconnexion",deconnecter);

export default router;