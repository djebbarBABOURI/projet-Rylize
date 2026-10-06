import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
    getCategories,
    ajoutCategorie,
    modifierCategorie,
    supprimerCategorie,
} from "../controlleurs/categorie.controlleur.js";

const router = express.Router();

router.use(protectRoute);
router.get("/", getCategories);
router.post("/", ajoutCategorie);
router.patch("/:id", modifierCategorie);
router.delete("/:id", supprimerCategorie);

export default router;
