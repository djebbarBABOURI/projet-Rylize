import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import modifUtilisateur from "../controlleurs/utilisateur.controlleur.js";
const router = express.Router();

router.patch("/modifUtilisateur/:id", protectRoute, modifUtilisateur);

export default router;