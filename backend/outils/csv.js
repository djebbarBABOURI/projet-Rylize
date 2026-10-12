// Export CSV pensé pour Excel en français : séparateur ";", virgule décimale, BOM UTF-8.

const SEPARATEUR = ";";

export const echapperCellule = (valeur) => {
    let texte = valeur === null || valeur === undefined ? "" : String(valeur);
    // Protection contre l'injection de formule (Excel exécute les cellules débutant par = + - @)
    if (/^[=+\-@\t\r]/.test(texte)) texte = `'${texte}`;
    if (/[;"\n\r]/.test(texte)) texte = `"${texte.replace(/"/g, '""')}"`;
    return texte;
};

export const versCsv = (depenses) => {
    const lignes = [["Date", "Catégorie", "Montant", "Description"].join(SEPARATEUR)];
    for (const d of depenses) {
        lignes.push(
            [
                new Date(d.date).toISOString().slice(0, 10),
                echapperCellule(d.categorie),
                d.montant.toFixed(2).replace(".", ","),
                echapperCellule(d.description),
            ].join(SEPARATEUR)
        );
    }
    return "﻿" + lignes.join("\r\n") + "\r\n";
};
