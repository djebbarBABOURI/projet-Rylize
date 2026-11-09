/* eslint-disable react/prop-types */
import { useState } from "react";
import toast from "react-hot-toast";
import { useCategories } from "../../hooks/useCategories.js";
import { api } from "../../services/api.js";

const LigneCategorie = ({ categorie, onChange }) => {
    const [nom, setNom] = useState(categorie.nom);
    const [couleur, setCouleur] = useState(categorie.couleur);
    const modifiee = nom.trim().toLowerCase() !== categorie.nom || couleur !== categorie.couleur;

    const enregistrer = async () => {
        try {
            await api.patch(`/api/categories/${categorie._id}`, { nom, couleur });
            toast.success("Catégorie modifiée");
            onChange();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const supprimer = async () => {
        try {
            await api.delete(`/api/categories/${categorie._id}`);
            toast.success("Catégorie supprimée");
            onChange();
        } catch (error) {
            toast.error(error.message); // ex. : catégorie encore utilisée par des dépenses
        }
    };

    return (
        <div className="flex items-center gap-2">
            <input type="color" value={couleur} onChange={(e) => setCouleur(e.target.value)} className="w-10 h-10 rounded cursor-pointer" aria-label="Couleur" />
            <input className="input input-bordered flex-1 capitalize" value={nom} onChange={(e) => setNom(e.target.value)} maxLength={50} aria-label="Nom de la catégorie" />
            <button className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700" disabled={!modifiee || !nom.trim()} onClick={enregistrer}>Enregistrer</button>
            <button className="btn btn-sm btn-ghost text-red-600" onClick={supprimer}>Supprimer</button>
        </div>
    );
};

const Categories = () => {
    const { categories, loading, recharger } = useCategories();
    const [nom, setNom] = useState("");
    const [couleur, setCouleur] = useState("#3b82f6");

    const ajouter = async (e) => {
        e.preventDefault();
        try {
            await api.post("/api/categories", { nom, couleur });
            toast.success("Catégorie ajoutée");
            setNom("");
            recharger();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="w-full p-8 bg-white shadow-lg rounded-lg max-w-2xl mx-auto">
            <h2 className="font-bold text-xl mb-4">Mes catégories</h2>
            <hr className="border-t-2 border-gray-300 mb-4" />

            <form onSubmit={ajouter} className="flex items-center gap-2 mb-6">
                <input type="color" value={couleur} onChange={(e) => setCouleur(e.target.value)} className="w-10 h-10 rounded cursor-pointer" aria-label="Couleur de la nouvelle catégorie" />
                <input className="input input-bordered flex-1" placeholder="Nouvelle catégorie (ex. abonnements)" value={nom} onChange={(e) => setNom(e.target.value)} maxLength={50} required />
                <button className="btn bg-blue-600 text-white hover:bg-blue-700">Ajouter</button>
            </form>

            {loading ? (
                <p>Chargement...</p>
            ) : (
                <div className="space-y-3">
                    {/* key inclut nom et couleur pour réinitialiser la ligne après rechargement */}
                    {categories.map((c) => (
                        <LigneCategorie key={`${c._id}-${c.nom}-${c.couleur}`} categorie={c} onChange={recharger} />
                    ))}
                </div>
            )}
            <p className="text-sm text-gray-500 mt-4">
                Renommer une catégorie met à jour vos dépenses et budgets. Une catégorie utilisée par des dépenses ne peut pas être supprimée.
            </p>
        </div>
    );
};

export default Categories;
