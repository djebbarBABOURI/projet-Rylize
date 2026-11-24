// Petit client HTTP : JSON en entrée/sortie et erreurs lisibles (message renvoyé par l'API)

const requete = async (url, { method = "GET", body } = {}) => {
    const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
    });

    let data = null;
    try {
        data = await res.json();
    } catch {
        // réponse sans corps JSON
    }
    if (!res.ok || data?.error) {
        throw new Error(data?.error || `Erreur ${res.status} - ${res.statusText}`);
    }
    if (data === null) {
        throw new Error("Réponse invalide du serveur (JSON attendu)");
    }
    return data;
};

export const api = {
    get: (url) => requete(url),
    post: (url, body) => requete(url, { method: "POST", body }),
    put: (url, body) => requete(url, { method: "PUT", body }),
    patch: (url, body) => requete(url, { method: "PATCH", body }),
    delete: (url, body) => requete(url, { method: "DELETE", body }),
};

// Construit "?a=1&b=2" en ignorant les valeurs vides
export const construireQuery = (params = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([cle, valeur]) => {
        if (valeur !== undefined && valeur !== null && valeur !== "") q.set(cle, valeur);
    });
    const texte = q.toString();
    return texte ? `?${texte}` : "";
};
