/* eslint-disable react/prop-types */
import { capitaliser, formaterMontant } from "../utils.js";

// Classes écrites en toutes lettres pour que Tailwind les détecte
const STYLES = {
    ok: { barre: "progress-success", badge: "badge-success", libelle: "Dans le budget" },
    attention: { barre: "progress-warning", badge: "badge-warning", libelle: "Bientôt atteint" },
    depasse: { barre: "progress-error", badge: "badge-error", libelle: "Dépassé" },
};

const BarreBudget = ({ budget, onSupprimer }) => {
    const style = STYLES[budget.statut] ?? STYLES.ok;
    const titre = budget.categorie === null ? "Budget global" : capitaliser(budget.categorie);

    return (
        <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{titre}</h3>
                <div className="flex items-center gap-2">
                    <span className={`badge ${style.badge}`}>{style.libelle}</span>
                    <button className="btn btn-ghost btn-xs" onClick={() => onSupprimer(budget)} aria-label={`Supprimer le budget ${titre}`}>✕</button>
                </div>
            </div>
            <progress className={`progress w-full ${style.barre}`} value={Math.min(budget.pourcentage, 100)} max="100"></progress>
            <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>{formaterMontant(budget.depense)} / {formaterMontant(budget.montant)} ({budget.pourcentage} %)</span>
                <span className={budget.reste < 0 ? "text-red-600 font-medium" : ""}>
                    {budget.reste < 0 ? `${formaterMontant(-budget.reste)} de dépassement` : `Reste ${formaterMontant(budget.reste)}`}
                </span>
            </div>
        </div>
    );
};

export default BarreBudget;
