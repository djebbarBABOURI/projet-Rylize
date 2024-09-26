import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/UtilisateurAuthContext";

export const useAjoutDepense = () => {
    const [loadingAjout, setLoadingAjout] = useState(false);
    const { authUtilisateur } = useAuthContext();
    const [HasError, setHasError] = useState({
        hasError: null,
        message: null,
    });

    // Initialisation de l'état pour les erreurs du formulaire
    const [formAjoutHasError, setFormAjoutHasError] = useState({
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
        setFormAjoutHasError({
            montant: { Error: null, message: null },
            categorie: { Error: null, message: null },
            date: { Error: null, message: null },
            description: { Error: null, message: null },
        });

        // Vérifier si les champs obligatoires sont remplis
        if (!montant || !categorie || !date) {
            setHasError({ hasError: true, message: 'Vous devez remplir les champs montant, catégorie, date et du formulaire !' });
            isFormHadErrors = false;
        }

        // Vérification du montant : doit être un nombre positif et un float
        const montantRegex = /^\d+(\.\d+)?$/; // Vérifie un nombre entier ou un nombre flottant positif
        if (!montant || !montantRegex.test(montant) || parseFloat(montant) <= 0) {
            setFormAjoutHasError(prevState => ({
                ...prevState,
                montant: { Error: true, message: "Le montant doit être un nombre positif." }
            }));
            isFormHadErrors = false;
        }

        // Vérification de la catégorie : doit être une chaîne non vide et de longueur acceptable
        if (!categorie || typeof categorie !== 'string' || categorie.trim() === "" || categorie.length > 50) {
            setFormAjoutHasError(prevState => ({
                ...prevState,
                categorie: { Error: true, message: "La catégorie ne peut pas être vide et doit avoir moins de 50 caractères." }
            }));
            isFormHadErrors = false;
        }

        // Vérification de la date : doit être une date valide
        if (!date || isNaN(Date.parse(date))) {
            setFormAjoutHasError(prevState => ({
                ...prevState,
                date: { Error: true, message: "La date doit être valide." }
            }));
            isFormHadErrors = false;
        }

        // Vérification de la description : doit être une chaîne de longueur acceptable
        if (description && typeof description === 'string' && description.length > 200) {
            setFormAjoutHasError(prevState => ({
                ...prevState,
                description: { Error: true, message: "La description doit avoir moins de 200 caractères." }
            }));
            isFormHadErrors = false;
        }

        return isFormHadErrors;
    };

    const ajoutDepense = async (montant, categorie, date, description) => {
        // const success = await handleInputErrors(montant, categorie, date, description);
        // console.log(formAjoutHasError);
        // console.log(success);
        // if (!success) return;
        const success = handleInputErrors(montant, categorie, date, description);
        if (success) {

            setLoadingAjout(true);

            try {
                const res = await fetch(`/api/depenses/ajoutDepense/${authUtilisateur._id}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ montant, categorie, date, description }),
                });

                const data = await res.json();
                if (!data.error) {
                    setHasError({ hasError: false, message: " La dépense a été ajouté avec succès!" });
                }
                if (data.error) {
                    throw new Error(data.error);
                }


            } catch (error) {
                console.log(error.message);
                toast.error(error.message);
            } finally {
                setLoadingAjout(false);
            }
        }
    };

    return { loadingAjout, ajoutDepense, HasError, formAjoutHasError };
};



