// Remplit la base avec un compte de démonstration : npm run seed
// Connexion : demo@rylize.dev / Demo1234!
import bcryptjs from "bcryptjs";
import config from "../config/env.js";
import { connexionMongoDB, deconnexionMongoDB } from "../bdd/connexionMongoDb.js";
import Utilisateur from "../model/utilisateur.model.js";
import Categorie from "../model/categorie.model.js";
import Depense from "../model/depense.model.js";
import Budget from "../model/budget.model.js";
import { assurerCategoriesParDefaut } from "../services/categorie.service.js";
import { BUDGETS_DEMO, genererDepensesDemo } from "./donneesDemo.js";

const EMAIL_DEMO = "demo@rylize.dev";
const MDP_DEMO = "Demo1234!";

if (config.isProd && !process.argv.includes("--force")) {
    console.error("Refus d'exécuter le seed en production (utiliser --force pour passer outre).");
    process.exit(1);
}

try {
    await connexionMongoDB();

    // Idempotent : on repart de zéro pour le compte de démo uniquement
    const ancien = await Utilisateur.findOne({ email: EMAIL_DEMO });
    if (ancien) {
        await Promise.all([
            Depense.deleteMany({ userId: ancien._id }),
            Categorie.deleteMany({ userId: ancien._id }),
            Budget.deleteMany({ userId: ancien._id }),
            Utilisateur.deleteOne({ _id: ancien._id }),
        ]);
    }

    const utilisateur = await Utilisateur.create({
        nom: "Démo",
        prenom: "Utilisateur",
        email: EMAIL_DEMO,
        mdp: await bcryptjs.hash(MDP_DEMO, 10),
        adresse: "1 rue de l'Exemple, 75000 Paris",
    });
    await assurerCategoriesParDefaut(utilisateur._id);

    const depenses = genererDepensesDemo(utilisateur._id);
    await Depense.insertMany(depenses);
    await Budget.insertMany(BUDGETS_DEMO.map((b) => ({ ...b, userId: utilisateur._id })));

    console.log(`Compte de démo prêt : ${EMAIL_DEMO} / ${MDP_DEMO}`);
    console.log(`${depenses.length} dépenses et ${BUDGETS_DEMO.length} budgets créés.`);
} catch (error) {
    console.error("Échec du seed :", error.message);
    process.exitCode = 1;
} finally {
    await deconnexionMongoDB();
}
