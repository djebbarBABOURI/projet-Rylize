import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getAnomalies, getPrevision, getStatutML, suggererCategorie } from "../controlleurs/ml.controlleur.js";

const router = express.Router();

router.use(protectRoute);
router.get("/statut", getStatutML);
router.get("/categorie", suggererCategorie);
router.get("/prevision", getPrevision);
router.get("/anomalies", getAnomalies);

export default router;
