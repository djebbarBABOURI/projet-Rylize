import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { ajoutDepense, modifierDepense, getDepensesUtilisateur } from "../controlleurs/depense.controlleur.js";
const router = express.Router();
router.post("/ajoutDepense/:id", protectRoute, ajoutDepense);
router.patch("/modifierDepense/:id", protectRoute, modifierDepense);
router.get("/getDepenses/", protectRoute, getDepensesUtilisateur);
export default router;