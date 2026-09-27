export const MDP_MIN = 8;
export const MDP_MAX = 72; // limite de bcrypt : au-delà, les caractères sont ignorés

// Retourne un message d'erreur, ou null si le mot de passe est acceptable
export const verifierNouveauMdp = (mdp) => {
    if (typeof mdp !== "string") return "Le mot de passe est obligatoire";
    if (mdp.length < MDP_MIN) return `Le mot de passe doit contenir au moins ${MDP_MIN} caractères`;
    if (Buffer.byteLength(mdp, "utf8") > MDP_MAX) return `Le mot de passe est trop long (${MDP_MAX} octets maximum)`;
    if (!/[A-Za-z]/.test(mdp) || !/\d/.test(mdp)) return "Le mot de passe doit contenir au moins une lettre et un chiffre";
    return null;
};
