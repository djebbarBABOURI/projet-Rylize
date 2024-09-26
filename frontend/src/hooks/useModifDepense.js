import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/UtilisateurAuthContext";

export const useModifDepense = () => {
    const [loadingModif, setLoadingModif] = useState(false);
    const { authUtilisateur } = useAuthContext();
    const [modifDepHasError, setModifDepHasError] = useState({
        hasError: null,
        message: null,
    });

    // Initialisation de l'état pour les erreurs du formulaire
    const [formModifHasError, setFormModifHasError] = useState({
        montant: { Error: null, message: null },
        categorie: { Error: null, message: null },
        date: { Error: null, message: null },
        description: { Error: null, message: null },
    });

    // Fonction de gestion des erreurs d'entrée
    // Fonction de gestion des erreurs d'entrée
    const handleInputErrors = (montant, categorie, date, description) => {
        let isFormHadErrors = true;

        // Réinitialiser les erreurs
        setFormModifHasError({
            montant: { Error: null, message: null },
            categorie: { Error: null, message: null },
            date: { Error: null, message: null },
            description: { Error: null, message: null },
        });

        // Vérifier si les champs obligatoires sont remplis
        if (!montant || !categorie || !date) {
            setModifDepHasError({ hasError: true, message: 'Vous devez remplir les champs montant, catégorie, date et du formulaire !' });
            isFormHadErrors = false;
        }

        // Vérification du montant : doit être un nombre positif ou un float
        const montantRegex = /^\d+(\.\d+)?$/; // Vérifie un nombre entier ou un nombre flottant positif
        if (!montant || !montantRegex.test(montant) || parseFloat(montant) <= 0) {
            setFormModifHasError(prevState => ({
                ...prevState,
                montant: { Error: true, message: "Le montant doit être un nombre positif." }
            }));
            isFormHadErrors = false;
        }

        // Vérification de la catégorie : doit être une chaîne non vide et de longueur acceptable
        if (!categorie || typeof categorie !== 'string' || categorie.trim() === "" || categorie.length > 50) {
            setFormModifHasError(prevState => ({
                ...prevState,
                categorie: { Error: true, message: "La catégorie ne peut pas être vide et doit avoir moins de 50 caractères." }
            }));
            isFormHadErrors = false;
        }

        // Vérification de la date : doit être une date valide
        if (!date || isNaN(Date.parse(date))) {
            setFormModifHasError(prevState => ({
                ...prevState,
                date: { Error: true, message: "La date doit être valide." }
            }));
            isFormHadErrors = false;
        }

        // Vérification de la description : doit être une chaîne de longueur acceptable
        if (description && typeof description === 'string' && description.length > 200) {
            setFormModifHasError(prevState => ({
                ...prevState,
                description: { Error: true, message: "La description doit avoir moins de 200 caractères." }
            }));
            isFormHadErrors = false;
        }

        return isFormHadErrors;
    };

    const modifDepense = async (montant, categorie, date, description, id_modif) => {
        const success = handleInputErrors(montant, categorie, date, description);
        if (success) {

            setLoadingModif(true);

            try {
                const res = await fetch(`/api/depenses/modifierDepense/${id_modif}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ montant, categorie, date, description }),
                });

                const data = await res.json();
                if (!data.error) {
                    setModifDepHasError({ hasError: false, message: " La dépense a été modifié avec succès!" });
                }
                if (data.error) {
                    throw new Error(data.error);
                }


            } catch (error) {
                console.log(error.message);
                toast.error(error.message);
            } finally {
                setLoadingModif(false);
            }
        }
    };

    return { loadingModif, modifDepense, modifDepHasError, formModifHasError };
};



