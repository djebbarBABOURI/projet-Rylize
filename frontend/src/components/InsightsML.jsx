/* eslint-disable react/prop-types */
import { useInsightsML } from "../hooks/useInsightsML.js";
import { capitaliser, formaterDate, formaterMontant } from "../utils.js";

const LIBELLES_MODELE = {
    moyenne: "moyenne des 3 derniers mois",
    ewma: "lissage exponentiel",
    tendance: "tendance linéaire",
};

const CartePrevision = ({ prevision }) => {
    const total = prevision?.total;
    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-1">Prévision du mois <span className="badge badge-sm badge-info align-middle">IA</span></h3>
            {!total?.disponible ? (
                <p className="text-sm text-gray-500">{total?.raison ?? "Pas assez de données pour prévoir."}</p>
            ) : (
                <>
                    <p className="text-2xl font-bold">{formaterMontant(total.valeur)}</p>
                    <p className="text-xs text-gray-500">
                        Fourchette probable (80 %) : {formaterMontant(total.bas)} – {formaterMontant(total.haut)}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                        Modèle : {LIBELLES_MODELE[total.modele] ?? total.modele}, calculé sur {total.nbMois} mois complets.
                    </p>
                    <ul className="text-sm space-y-1">
                        {prevision.parCategorie.slice(0, 4).map((c) => (
                            <li key={c.categorie} className="flex justify-between">
                                <span>{capitaliser(c.categorie)}</span>
                                <span className="font-medium">{formaterMontant(c.valeur)}</span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

const CarteAnomalies = ({ resultat }) => (
    <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-1">Dépenses inhabituelles <span className="badge badge-sm badge-info align-middle">IA</span></h3>
        {!resultat?.disponible ? (
            <p className="text-sm text-gray-500">{resultat?.raison ?? "Pas assez de données."}</p>
        ) : resultat.anomalies.length === 0 ? (
            <p className="text-sm text-green-700">Rien d&apos;inhabituel sur la période.</p>
        ) : (
            <ul className="space-y-2">
                {resultat.anomalies.slice(0, 4).map((a) => (
                    <li key={a.id} className="text-sm border-l-4 border-orange-400 pl-2">
                        <div className="flex justify-between">
                            <span className="font-medium">{formaterMontant(a.montant)} · {capitaliser(a.categorie)}</span>
                            <span className="text-gray-500">{formaterDate(a.date)}</span>
                        </div>
                        <div className="text-xs text-gray-500">{a.description ? `${a.description} — ` : ""}{a.raison}</div>
                    </li>
                ))}
            </ul>
        )}
    </div>
);

// Cartes alimentées par le service de machine learning ; masquées s'il n'est pas disponible
const InsightsML = ({ bornes, version }) => {
    const { chargement, disponible, prevision, anomalies } = useInsightsML(bornes, version);
    if (!disponible || (chargement && !prevision)) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <CartePrevision prevision={prevision} />
            <CarteAnomalies resultat={anomalies} />
        </div>
    );
};

export default InsightsML;
