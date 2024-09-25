import { useAuthContext } from "../../context/UtilisateurAuthContext";
import { useState } from "react";
import InsForm from "../inscription/InsForm.jsx";
//import ImageProfil from "./ImageProfil.jsx";
import AlertHandling from "./AlertHandling.jsx";
const Profil = () => {
    const { authUtilisateur, setAuthUtilisateur } = useAuthContext();
    const [inputs, setInputs] = useState({
        nom: authUtilisateur.nom,
        prenom: authUtilisateur.prenom,
        email: authUtilisateur.email,
        adresse: authUtilisateur.adresse,
        imgProfil: authUtilisateur.imgProfil,
    });

    const [modifHasError, setModifHasError] = useState({
        hasError: null,
        message: null,
    });
    // Fonction pour fermer la modale
    const closeModal = () => {
        const modal = document.getElementById("my_modal_4");
        if (modal) {
            setInputs({ ...inputs, nom: authUtilisateur.nom, prenom: authUtilisateur.prenom, email: authUtilisateur.email, adresse: authUtilisateur.adresse, imgProfil: authUtilisateur.imgProfil });
            modal.close();
        }
    };
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
                    return true;
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            setModifHasError({ hasError: true, message: 'Vous devez selectionner une image !' });
            return false;
        }
    };


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
            if (handleInputErrorsModif(inputs.nom, inputs.prenom, inputs.email, inputs.adresse) && changImgProfil(inputs.imgProfil)) {
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
                        adresse: inputs.adresse,
                        imgProfil: inputs.imgProfil,
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

                        <div className="avatar w-48 md:w-36">
                            <div className="w-96 rounded-full">
                                {inputs.imgProfil ? (<img src={`${inputs.imgProfil}`} alt="imag profil" className="rounded-full w-full h-auto max-w-xs md:max-w-md lg:max-w-lg border-4 border-blue-500 p-1" />
                                ) : (
                                    <img
                                        src="./avatar-icon.png"
                                        alt="image profil"
                                        className="rounded-full w-full h-auto max-w-xs md:max-w-md lg:max-w-lg border-4 border-blue-500 p-1"
                                    />
                                )}
                            </div>
                        </div>
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

                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeModal}>✕</button>

                        <br />
                        <form className="flex flex-col md:flex-row" onSubmit={(e) => { handlePatchUpdate(e) }}>
                            {/* ImageProfil à droite */}
                            <div className="flex-[0.2] flex items-center justify-center ml-12 mr-8 mb-6 mt-6 md:items-baseline md:justify-start">

                                <div className="flex flex-col items-center space-y-4">
                                    <div className="avatar w-48 md:w-36">
                                        <div className="w-96 rounded-full">
                                            {inputs.imgProfil ? (
                                                <img
                                                    src={`${inputs.imgProfil}`}
                                                    alt="image profil"
                                                    className="rounded-full w-full h-auto max-w-xs md:max-w-md lg:max-w-lg border-4 border-blue-500 p-1"
                                                />
                                            ) : (
                                                <img
                                                    src="./avatar-icon.png"
                                                    alt="image profil"
                                                    className="rounded-full w-full h-auto max-w-xs md:max-w-md lg:max-w-lg border-4 border-blue-500 p-1"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        name="custom-file"
                                        id="custom-file"
                                        onChange={(e) => changImgProfil(e.target.files[0])}
                                    />
                                </div>

                            </div>

                            {/* InsForm à gauche */}
                            <div className="flex-[0.8]">
                                <InsForm inputs={inputs} setInputs={setInputs} isInscription={false} />
                                <div>
                                    <AlertHandling modifHasError={modifHasError} classM="modifAfficheError" />
                                </div>
                                <div className="flex justify-end mt-6 space-x-2">
                                    <button className="btn" type="submit">Modifier</button>
                                    <button className="btn" type="button" onClick={closeModal}>Fermer</button>
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
