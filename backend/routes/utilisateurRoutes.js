import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { limiteurAuth } from "../middleware/limiteur.js";
import modifUtilisateur, { changerMotDePasse } from "../controlleurs/utilisateur.controlleur.js";
const router = express.Router();

router.patch("/modifUtilisateur/:id", protectRoute, modifUtilisateur);

// Même limitation que la connexion : l'ancien mot de passe ne doit pas pouvoir être deviné par force brute
router.patch("/motdepasse", limiteurAuth, protectRoute, changerMotDePasse);

export default router;