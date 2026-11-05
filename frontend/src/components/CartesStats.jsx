/* eslint-disable react/prop-types */
import { capitaliser, formaterMontant } from "../utils.js";

const Carte = ({ titre, valeur, detail, classeValeur = "" }) => (
    <div className="stat bg-white rounded-lg shadow p-4">
        <div className="stat-title text-gray-500">{titre}</div>
        <div className={`stat-value text-2xl ${classeValeur}`}>{valeur}</div>
        {detail && <div className="stat-desc">{detail}</div>}
    </div>
);

// Cartes de synthèse du mois (données de GET /api/statistiques/resume)
const CartesStats = ({ resume }) => {
    if (!resume) return null;
    const { total, variation, moyenneJournaliere, projection, categorieTop, totalPrecedent } = resume;

    let detailVariation = "Pas de dépenses le mois précédent";
    let classeVariation = "";
    if (variation !== null) {
        // Une hausse des dépenses est affichée en rouge, une baisse en vert
        classeVariation = variation > 0 ? "text-red-600" : variation < 0 ? "text-green-600" : "";
        detailVariation = `${variation > 0 ? "▲" : variation < 0 ? "▼" : "="} ${Math.abs(variation)} % vs mois précédent (${formaterMontant(totalPrecedent)})`;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Carte titre="Dépenses du mois" valeur={formaterMontant(total)} detail={detailVariation} classeValeur={classeVariation} />
            <Carte titre="Moyenne par jour" valeur={formaterMontant(moyenneJournaliere)} />
            <Carte
                titre="Projection fin de mois"
                valeur={projection === null ? "—" : formaterMontant(projection)}
                detail={projection === null ? "Mois terminé" : "Au rythme actuel"}
            />
            <Carte
                titre="Catégorie la plus coûteuse"
                valeur={categorieTop ? capitaliser(categorieTop.categorie) : "—"}
                detail={categorieTop ? formaterMontant(categorieTop.total) : "Aucune dépense"}
            />
        </div>
    );
};

export default CartesStats;
