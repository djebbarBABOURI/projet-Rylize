import { useAuthContext } from "../../context/UtilisateurAuthContext";
//import Inscription from "../inscription/Inscription";
import { useState } from "react";
import InsForm from "../inscription/InsForm.jsx";
import ImageProfil from "./ImageProfil.jsx";
import AlertHandling from "./AlertHandling.jsx";
//import toast from "react-hot-toast";
const Profil = () => {
    const { authUtilisateur, setAuthUtilisateur } = useAuthContext();
    const [inputs, setInputs] = useState({
        nom: authUtilisateur.nom,
        prenom: authUtilisateur.prenom,
        email: authUtilisateur.email,
        adresse: authUtilisateur.adresse,
    });

    const [modifHasError, setModifHasError] = useState({
        hasError: null,
        message: null,
    });



    function handleInputErrorsModif(nom, prenom, email, adresse) {
        if (!nom || !prenom || !email || !adresse) {
            setModifHasError({ hasError: true, message: 'Vous devez remplir tout les champs du formulaire !' });
            return false;
        }
        return true;
    }


    const handlePatchUpdate = async (e) => {
        e.preventDefault();

        try {
            if (handleInputErrorsModif(inputs.nom, inputs.prenom, inputs.email, inputs.adresse)) {
                // eslint-disable-next-line no-unused-vars
                const response = await fetch(`api/utilisateur/modifUtilisateur/${authUtilisateur._id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nom: inputs.nom,
                        prenom: inputs.prenom,
                        email: inputs.email,
                        adresse: inputs.adresse
                    })
                }).then((res) => res.json())
                    .then((data) => { setAuthUtilisateur(data); localStorage.setItem("Auth-Utilisateur", JSON.stringify(data)); setModifHasError({ hasError: false, message: 'Modification du profil a été faite avec succés!' }); })

            }


        } catch (error) {
            console.error('Erreur lors de la mise à jour :', error);
        }
    };



    return (
        <>
            <br />
            <div className='w-full md:flex-row p-4 bg-white shadow-lg rounded-lg max-w-4xl mx-auto'>
                <div className="w-full mb-4">
                    <h2 className="font-bold text-xl w-full">Mon profil</h2>
                    <hr className="border-t-2 border-gray-300 mt-2" />
                </div>


                <div className="w-full flex flex-col md:flex-row mb-4">
                    <div className="flex-[0.2] flex items-center justify-center mb-6 mt-6 ml-12 mr-8 md:items-baseline md:justify-start ">
                        <ImageProfil className="w-full h-auto max-w-xs md:max-w-md lg:max-w-lg" /> {/* Ajout de classes pour la taille */}
                    </div>

                    {/* Agrandissement de l'espace pour les informations */}
                    <div className="flex-[0.8]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Champ Nom */}
                            <div>
                                <label className='label'>
                                    <span className='text-sm font-medium text-gray-600'>Nom</span>
                                </label>
                                <div className='w-full text-sm h-10 rounded-md shadow-sm border-gray-300 bg-gray-100 flex items-center p-2'>
                                    <span>{authUtilisateur.nom || 'Non renseigné'}</span>
                                </div>
                            </div>

                            {/* Champ Prénom */}
                            <div>
                                <label className='label'>
                                    <span className='text-sm font-medium text-gray-600'>Prénom</span>
                                </label>
                                <div className='w-full text-sm h-10 rounded-md shadow-sm border-gray-300 bg-gray-100 flex items-center p-2'>
                                    <span>{authUtilisateur.prenom || 'Non renseigné'}</span>
                                </div>
                            </div>

                            {/* Champ Email */}
                            <div>
                                <label className='label'>
                                    <span className='text-sm font-medium text-gray-600'>Email</span>
                                </label>
                                <div className='w-full text-sm h-10 rounded-md shadow-sm border-gray-300 bg-gray-100 flex items-center p-2'>
                                    <span>{authUtilisateur.email || 'Non renseigné'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Champ Adresse */}
                        <div>
                            <label className='label mt-6'>
                                <span className='text-sm font-medium text-gray-600'>Adresse</span>
                            </label>
                            <div className='w-full text-sm h-24 rounded-md shadow-sm border-gray-300 bg-gray-100 flex items-start p-2'>
                                <span>{authUtilisateur.adresse || 'Non renseigné'}</span>
                            </div>
                        </div>

                        <div>
                            <button onClick={() => document.getElementById('my_modal_4').showModal()} className='btn btn-block h-10 mt-4 border border-transparent bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-200 mt-6'>
                                Modifier
                            </button>
                        </div>

                    </div>
                </div>



                <dialog id="my_modal_4" className="modal">
                    <div className="modal-box w-11/12 max-w-5xl">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <br />

                        <form className="flex flex-col md:flex-row" onSubmit={(e) => { handlePatchUpdate(e) }}>


                            {/* ImageProfil à droite */}
                            <div className="flex-[0.2] flex items-center justify-center ml-12 mr-8 mb-6 mt-6 md:items-baseline md:justify-start">
                                <ImageProfil className="w-full h-auto max-w-xs md:max-w-md lg:max-w-lg" /> {/* Ajout de classes pour la taille */}
                            </div>

                            {/* InsForm à gauche */}
                            <div className="flex-[0.8]">
                                <InsForm inputs={inputs} setInputs={setInputs} isInscription={false} />
                                <div>
                                    <AlertHandling modifHasError={modifHasError} classM="modifAfficheError" />
                                </div>
                                <div className="flex justify-end mt-6 space-x-2">
                                    <button className="btn" type="submit">Modifier</button>
                                    <form method="dialog" className="flex justify-end">
                                        {/* if there is a button, it will close the modal */}
                                        <button className="btn">Fermer</button>
                                    </form>
                                </div>

                            </div>

                        </form>

                    </div>
                </dialog>



            </div>

        </>

    );
};
export default Profil;
