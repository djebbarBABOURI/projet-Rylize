import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { ajoutDepense, modifierDepense, getDepensesUtilisateur, deleteDepenses } from "../controlleurs/depense.controlleur.js";
const router = express.Router();
router.post("/ajoutDepense/:id", protectRoute, ajoutDepense);
router.patch("/modifierDepense/:id", protectRoute, modifierDepense);
router.get("/getDepenses/", protectRoute, getDepensesUtilisateur);
router.delete("/deleteDepenses/", protectRoute, deleteDepenses);
export default router;