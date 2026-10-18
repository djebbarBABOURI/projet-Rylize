import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getResumeMensuel, getStatistiques } from "../controlleurs/statistiques.controlleur.js";

const router = express.Router();

router.use(protectRoute);
// GET /api/statistiques?du=2026-01-01&au=2026-12-31
router.get("/", getStatistiques);
// GET /api/statistiques/resume?mois=2026-11 (mois courant par défaut)
router.get("/resume", getResumeMensuel);

export default router;
