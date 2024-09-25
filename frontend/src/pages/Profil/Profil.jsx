//import React from "react";
import useModifProfil from "../../hooks/useModifProfil.js";
import InsForm from "../inscription/InsForm.jsx";
import AlertHandling from "./AlertHandling.jsx";
import { useAuthContext } from "../../context/UtilisateurAuthContext";

const Profil = () => {
    const { authUtilisateur } = useAuthContext();
    const { inputs, setInputs, modifHasError, changImgProfil, handlePatchUpdate, loading } = useModifProfil();

    const closeModal = () => {
        const modal = document.getElementById("my_modal_4");
        if (modal) {
            setInputs({ ...inputs, nom: authUtilisateur.nom, prenom: authUtilisateur.prenom, email: authUtilisateur.email, adresse: authUtilisateur.adresse, imgProfil: authUtilisateur.imgProfil });
            modal.close();
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
                                {inputs.imgProfil ? (
                                    <img src={`${inputs.imgProfil}`} alt="imag profil" className="rounded-full w-full h-auto max-w-xs md:max-w-md lg:max-w-lg border-4 border-blue-500 p-1" />
                                ) : (
                                    <img src="./avatar-icon.png" alt="image profil" className="rounded-full w-full h-auto max-w-xs md:max-w-md lg:max-w-lg border-4 border-blue-500 p-1" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex-[0.8]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className='label'>
                                    <span className='text-sm font-medium text-gray-600'>Nom</span>
                                </label>
                                <div className='w-full text-sm h-10 rounded-md shadow-sm border-gray-300 bg-gray-100 flex items-center p-2'>
                                    <span>{inputs.nom || 'Non renseigné'}</span>
                                </div>
                            </div>
                            <div>
                                <label className='label'>
                                    <span className='text-sm font-medium text-gray-600'>Prénom</span>
                                </label>
                                <div className='w-full text-sm h-10 rounded-md shadow-sm border-gray-300 bg-gray-100 flex items-center p-2'>
                                    <span>{inputs.prenom || 'Non renseigné'}</span>
                                </div>
                            </div>
                            <div>
                                <label className='label'>
                                    <span className='text-sm font-medium text-gray-600'>Email</span>
                                </label>
                                <div className='w-full text-sm h-10 rounded-md shadow-sm border-gray-300 bg-gray-100 flex items-center p-2'>
                                    <span>{inputs.email || 'Non renseigné'}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className='label mt-6'>
                                <span className='text-sm font-medium text-gray-600'>Adresse</span>
                            </label>
                            <div className='w-full text-sm h-24 rounded-md shadow-sm border-gray-300 bg-gray-100 flex items-start p-2'>
                                <span>{inputs.adresse || 'Non renseigné'}</span>
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
                        <form className="flex flex-col md:flex-row" onSubmit={handlePatchUpdate}>
                            <div className="flex-[0.2] flex items-center justify-center ml-12 mr-8 mb-6 mt-6 md:items-baseline md:justify-start">
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="avatar w-48 md:w-36">
                                        <div className="w-96 rounded-full">
                                            {inputs.imgProfil ? (
                                                <img src={`${inputs.imgProfil}`} alt="image profil" className="rounded-full w-full h-auto max-w-xs md:max-w-md lg:max-w-lg border-4 border-blue-500 p-1" />
                                            ) : (
                                                <img src="./avatar-icon.png" alt="image profil" className="rounded-full w-full h-auto max-w-xs md:max-w-md lg:max-w-lg border-4 border-blue-500 p-1" />
                                            )}
                                        </div>
                                    </div>
                                    <input type="file" name="custom-file" id="custom-file" onChange={(e) => changImgProfil(e.target.files[0])} />
                                </div>
                            </div>

                            <div className="flex-[0.8]">
                                <InsForm inputs={inputs} setInputs={setInputs} isInscription={false} />
                                <AlertHandling modifHasError={modifHasError} classM="modifAfficheError" />
                                <div className="flex justify-end mt-6 space-x-2">
                                    <button className="btn" type="submit" disabled={loading}>{loading ? <span className="loading loading-dots loading-md"></span> : "Modifier"}</button>
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
