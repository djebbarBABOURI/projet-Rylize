import { useState } from "react";
import { useAuthContext } from "../context/UtilisateurAuthContext";

const useModifProfil = () => {
    const { authUtilisateur, setAuthUtilisateur } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [inputs, setInputs] = useState({
        nom: authUtilisateur.nom,
        prenom: authUtilisateur.prenom,
        email: authUtilisateur.email,
        adresse: authUtilisateur.adresse,
        imgProfil: authUtilisateur.imgProfil,
    });
    const [imageValid, setImageValid] = useState(true);
    const [modifHasError, setModifHasError] = useState({
        hasError: null,
        message: null,
    });

    const changImgProfil = (imgp) => {
        if (imgp.type === "image/jpeg" || imgp.type === "image/png") {
            const data = new FormData();
            data.append("file", imgp);
            data.append("upload_preset", "notezipper");
            data.append("cloud_name", "piyushproj");
            fetch("https://api.cloudinary.com/v1_1/piyushproj/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setInputs({ ...inputs, imgProfil: data.url.toString() });
                    setImageValid(true);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            setModifHasError({ hasError: true, message: 'Vous devez selectionner une image !' });
            setImageValid(false);
        }
    };

    const handleInputErrorsModif = (nom, prenom, email, adresse) => {
        if (!nom || !prenom || !email || !adresse) {
            setModifHasError({ hasError: true, message: 'Vous devez remplir tout les champs du formulaire !' });
            return false;
        }
        return true;
    };

    const handlePatchUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (handleInputErrorsModif(inputs.nom, inputs.prenom, inputs.email, inputs.adresse) && imageValid) {
                const response = await fetch(`api/utilisateur/modifUtilisateur/${authUtilisateur._id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nom: inputs.nom,
                        prenom: inputs.prenom,
                        email: inputs.email,
                        adresse: inputs.adresse,
                        imgProfil: inputs.imgProfil,
                    }),
                }).then((res) => res.json());

                if (!response.error) {
                    setAuthUtilisateur(response);
                    localStorage.setItem("Auth-Utilisateur", JSON.stringify(response));
                    setModifHasError({ hasError: false, message: 'La modification du profil a été faite avec succès!' });
                }
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour :', error);
        } finally {
            setLoading(false);
        }
    };

    return {
        inputs,
        setInputs,
        imageValid,
        modifHasError,
        changImgProfil,
        handlePatchUpdate,
        loading,
    };
};

export default useModifProfil;
