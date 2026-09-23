import rateLimit from "express-rate-limit";

// Limite les tentatives de connexion / inscription (protection contre le brute force)
export const limiteurAuth = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { error: "Trop de tentatives, réessayez dans quelques minutes." },
});

// Limite globale de l'API
export const limiteurApi = rateLimit({
    windowMs: 60 * 1000,
    limit: 300,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { error: "Trop de requêtes, ralentissez." },
});
