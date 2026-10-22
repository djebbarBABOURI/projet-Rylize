import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { limiteurApi, limiteurAuth } from "./middleware/limiteur.js";
import authRoutes from "./routes/authautification.routes.js";
import utilisateurRoutes from "./routes/utilisateurRoutes.js";
import depenseRoutes from "./routes/depense.routes.js";
import categorieRoutes from "./routes/categorie.routes.js";
import statistiquesRoutes from "./routes/statistiques.routes.js";
import budgetRoutes from "./routes/budget.routes.js";
import santeRoutes from "./routes/sante.routes.js";

// L'application Express est séparée du démarrage du serveur pour pouvoir être testée
const app = express();

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use("/api/sante", santeRoutes);
app.use("/api", limiteurApi);
app.use("/api/authautification/", limiteurAuth, authRoutes);
app.use("/api/utilisateur/", utilisateurRoutes);
app.use("/api/depenses/", depenseRoutes);
app.use("/api/categories", categorieRoutes);
app.use("/api/statistiques", statistiquesRoutes);
app.use("/api/budgets", budgetRoutes);

export default app;
