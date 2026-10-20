import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getBudgets, definirBudget, supprimerBudget } from "../controlleurs/budget.controlleur.js";

const router = express.Router();

router.use(protectRoute);
router.get("/", getBudgets); // ?mois=AAAA-MM
router.put("/", definirBudget); // { categorie?, montant }
router.delete("/:id", supprimerBudget);

export default router;
