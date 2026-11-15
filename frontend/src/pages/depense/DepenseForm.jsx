/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useAjoutDepense } from "../../hooks/useAjoutDepense";
import { useModifDepense } from "../../hooks/useModifDepense";
import { useCategories } from "../../hooks/useCategories";
import { useSuggestionCategorie } from "../../hooks/useSuggestionCategorie";
import AlertHandling from "../Profil/AlertHandling.jsx";
import AlertMsgAffiche from '../../components/AlertMsgAffiche.jsx';
const DepenseForm = ({ depense, isAjoutDepense, reloadData }) => {
    const { loadingAjout, ajoutDepense, HasError, formAjoutHasError } = useAjoutDepense();
    const { loadingModif, modifDepense, modifDepHasError, formModifHasError } = useModifDepense();
    const { categories } = useCategories();


    const [inputs, setInputs] = useState({
        id_modif: "",
        montant: "",
        categorie: "",
        date: "",
        description: "",
    });

    // useEffect pour initialiser les inputs avec les valeurs de depense si elles existent
    useEffect(() => {
        if (depense) {
            setInputs({
                id_modif: depense._id || "",
                montant: depense.montant || "",
                categorie: depense.categorie || "",
                date: depense.date || "",
                description: depense.description || "",
            });
        }
    }, [depense]);

    // Suggestion de catégorie par machine learning (uniquement quand aucune catégorie n'est choisie)
    const { suggestions, source } = useSuggestionCategorie(inputs.description, !inputs.categorie);
    const choisirSuggestion = (nom) => setInputs((precedent) => ({ ...precedent, categorie: nom }));


    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isAjoutDepense) {
            await ajoutDepense(inputs.montant, inputs.categorie, inputs.date, inputs.description);
            reloadData();
        } else {
            await modifDepense(inputs.montant, inputs.categorie, inputs.date, inputs.description, inputs.id_modif);
            reloadData();
        }

    };
    const formatDateForInput = (isoDateString) => {
        // Vérifiez si la chaîne de date existe et est valide
        if (!isoDateString) return ""; // Retourne une chaîne vide si la date est invalide

        const date = new Date(isoDateString);

        // Vérifiez si la conversion en objet Date a échoué
        if (isNaN(date.getTime())) return ""; // Si la date n'est pas valide, retourne une chaîne vide

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Mois entre 01 et 12
        const day = String(date.getDate()).padStart(2, '0');        // Jour entre 01 et 31

        return `${year}-${month}-${day}`; // Retourne le format yyyy-MM-dd
    };

    return (
        <div className='flex items-center justify-center min-w-96 mx-auto'>
            <div className='h-full w-full p-6 bg-white rounded-lg transition-shadow duration-300'>
                <div className="w-full mb-4">
                    <h2 className="font-bold text-xl w-full">{isAjoutDepense ? "Ajouter Dépense" : "Modifier Dépense"}</h2>
                    <hr className="border-t-2 border-gray-300 mt-2" />
                </div>
                <form className='space-y-4' onSubmit={handleSubmit}>
                    {/* Montant */}
                    <div className="mb-4">
                        <label className='block text-sm font-medium text-gray-700'>Montant</label>
                        <input
                            type="number"
                            name="montant"
                            value={inputs.montant}
                            onChange={handleChange}
                            className="input input-bordered w-full focus:border-blue-500 focus:ring focus:ring-blue-200"

                        />
                        {isAjoutDepense ?
                            (formAjoutHasError.montant.Error && (
                                <AlertMsgAffiche message={formAjoutHasError.montant.message} />

                            )) :
                            (formModifHasError.montant.Error && (
                                <AlertMsgAffiche message={formModifHasError.montant.message} />

                            ))
                        }


                    </div>

                    {/* Catégorie */}
                    <div className="mb-4">
                        <label className='block text-sm font-medium text-gray-700'>Catégorie</label>
                        <select
                            name="categorie"
                            value={inputs.categorie}
                            onChange={handleChange}
                            className="select select-bordered w-full focus:border-blue-500 focus:ring focus:ring-blue-200"

                        >
                            <option value="" disabled>Choisir une catégorie</option>
                            {categories.map((c) => (
                                <option key={c._id} value={c.nom} className="capitalize">{c.nom.charAt(0).toUpperCase() + c.nom.slice(1)}</option>
                            ))}
                        </select>
                        {isAjoutDepense ? (
                            formAjoutHasError.categorie.Error && (
                                <AlertMsgAffiche message={formAjoutHasError.categorie.message} />

                            )) : (
                            formModifHasError.categorie.Error && (
                                <AlertMsgAffiche message={formModifHasError.categorie.message} />

                            )
                        )
                        }
                    </div>

                    {/* Date */}
                    <div className="mb-4">
                        <label className='block text-sm font-medium text-gray-700'>Date</label>
                        <input
                            type="date"
                            name="date"
                            value={isAjoutDepense ? inputs.date : formatDateForInput(inputs.date)}
                            onChange={handleChange}
                            className="input input-bordered w-full focus:border-blue-500 focus:ring focus:ring-blue-200"
                        />
                        {isAjoutDepense ? (
                            formAjoutHasError.date.Error && (
                                <AlertMsgAffiche message={formAjoutHasError.date.message} />

                            )) : (
                            formModifHasError.date.Error && (
                                <AlertMsgAffiche message={formModifHasError.date.message} />

                            )
                        )
                        }
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label className='block text-sm font-medium text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200'>Description</label>
                        <textarea
                            name="description"
                            value={inputs.description}
                            onChange={handleChange}
                            className="textarea textarea-bordered w-full focus:border-blue-500 focus:ring focus:ring-blue-200"
                        />
                        {isAjoutDepense ? (
                            formAjoutHasError.description.Error && (
                                <AlertMsgAffiche message={formAjoutHasError.description.message} />

                            )) : (
                            formModifHasError.description.Error && (
                                <AlertMsgAffiche message={formModifHasError.description.message} />

                            )
                        )
                        }
                    </div>
                    {/* Catégorie suggérée par le modèle de machine learning */}
                    {!inputs.categorie && suggestions.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 text-sm" aria-live="polite">
                            <span className="text-gray-600">
                                Catégorie suggérée{source === "personnalise" ? " (selon vos habitudes)" : ""} :
                            </span>
                            {suggestions.slice(0, 3).map((s) => (
                                <button
                                    type="button"
                                    key={s.categorie}
                                    className="badge badge-outline badge-lg cursor-pointer hover:bg-blue-600 hover:text-white capitalize"
                                    onClick={() => choisirSuggestion(s.categorie)}
                                >
                                    {s.categorie} · {Math.round(s.probabilite * 100)} %
                                </button>
                            ))}
                        </div>
                    )}
                    <AlertHandling modifHasError={isAjoutDepense ? HasError : modifDepHasError} classM="modifAfficheError" />
                    {/* Button */}
                    <div>
                        <button className='btn btn-block h-10 mt-4 border border-transparent bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-200'
                            disabled={isAjoutDepense ? loadingAjout : loadingAjout} >
                            {isAjoutDepense ? (loadingAjout ? <span className="loading loading-dots loading-md"></span> : "Ajouter Dépense") : (loadingModif ? <span className="loading loading-dots loading-md"></span> : "Modifier Dépense")}
                        </button>
                    </div>
                </form>
            </div>
        </div>


    );
};

export default DepenseForm;
