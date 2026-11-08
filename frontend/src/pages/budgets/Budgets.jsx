import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import BarreBudget from "../../components/BarreBudget.jsx";
import { useCategories } from "../../hooks/useCategories.js";
import { api, construireQuery } from "../../services/api.js";
import { capitaliser, moisCourant } from "../../utils.js";

const Budgets = () => {
    const [mois, setMois] = useState(moisCourant());
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categorie, setCategorie] = useState(""); // "" = budget global
    const [montant, setMontant] = useState("");
    const { categories } = useCategories();

    const charger = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.get(`/api/budgets${construireQuery({ mois })}`);
            setBudgets(data.budgets);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }, [mois]);

    useEffect(() => {
        charger();
    }, [charger]);

    const enregistrer = async (e) => {
        e.preventDefault();
        try {
            await api.put("/api/budgets", { categorie: categorie || null, montant });
            toast.success("Budget enregistré");
            setMontant("");
            charger();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const supprimer = async (budget) => {
        try {
            await api.delete(`/api/budgets/${budget._id}`);
            toast.success("Budget supprimé");
            charger();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="w-full p-8 bg-white shadow-lg rounded-lg max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-xl">Budgets mensuels</h2>
                <input
                    type="month"
                    className="input input-bordered input-sm"
                    value={mois}
                    onChange={(e) => e.target.value && setMois(e.target.value)}
                    aria-label="Mois"
                />
            </div>
            <hr className="border-t-2 border-gray-300 mb-4" />

            <form onSubmit={enregistrer} className="flex flex-col sm:flex-row gap-2 mb-6">
                <select className="select select-bordered flex-1" value={categorie} onChange={(e) => setCategorie(e.target.value)}>
                    <option value="">Budget global (toutes catégories)</option>
                    {categories.map((c) => (
                        <option key={c._id} value={c.nom}>{capitaliser(c.nom)}</option>
                    ))}
                </select>
                <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Montant mensuel (€)"
                    className="input input-bordered flex-1"
                    value={montant}
                    onChange={(e) => setMontant(e.target.value)}
                    required
                />
                <button className="btn bg-blue-600 text-white hover:bg-blue-700">Enregistrer</button>
            </form>

            {loading ? (
                <p>Chargement des budgets...</p>
            ) : budgets.length === 0 ? (
                <p className="text-gray-500 text-center">Aucun budget défini. Ajoutez-en un ci-dessus pour suivre vos limites de dépenses.</p>
            ) : (
                <div className="space-y-3">
                    {budgets.map((b) => (
                        <BarreBudget key={b._id} budget={b} onSupprimer={supprimer} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Budgets;
