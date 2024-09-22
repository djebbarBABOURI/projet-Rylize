import { useState } from "react";
import { Link } from "react-router-dom";
import useInscription from "../../hooks/useInscription.js";

const Inscription = () => {
    const [inputs, setInputs] = useState({
        nom: "",
        prenom: "",
        email: "",
        mdp: "",
        confirm_mdp: "",
        adresse: "",
    });
    const { loading, inscription } = useInscription();
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(inputs);
        await inscription(inputs);
    }
    return (
        <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
            <div className='h-full w-full p-6 bg-white rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                <h1 className='text-3xl font-semibold text-gray-800 text-center mb-6'>
                    Inscription
                </h1>

                <form className='space-y-6' onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className='label'>
                                <span className='text-sm font-medium text-gray-600'>Nom</span>
                            </label>
                            <input
                                type='text'
                                placeholder='Entrer votre nom'
                                className='w-full text-sm input input-bordered h-10 rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200'
                                value={inputs.nom}
                                onChange={(e) => setInputs({ ...inputs, nom: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className='label'>
                                <span className='text-sm font-medium text-gray-600'>Prénom</span>
                            </label>
                            <input
                                type='text'
                                placeholder='Entrer votre prénom'
                                className='w-full text-sm input input-bordered h-10 rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200'
                                value={inputs.prenom}
                                onChange={(e) => setInputs({ ...inputs, prenom: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className='label'>
                                <span className='text-sm font-medium text-gray-600'>Email</span>
                            </label>
                            <input
                                type='email'
                                placeholder='Entrer votre email'
                                className='w-full text-sm input input-bordered h-10 rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200'
                                value={inputs.email}
                                onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className='label'>
                                <span className='text-sm font-medium text-gray-600'>Mot de passe</span>
                            </label>
                            <input
                                type='password'
                                placeholder='Entrer le mot de passe'
                                className='w-full text-sm input input-bordered h-10 rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200'
                                value={inputs.mdp}
                                onChange={(e) => setInputs({ ...inputs, mdp: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className='label'>
                                <span className='text-sm font-medium text-gray-600'>Confirmation de mot de passe</span>
                            </label>
                            <input
                                type='password'
                                placeholder='Confirmer le mot de passe'
                                className='w-full text-sm input input-bordered h-10 rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200'
                                value={inputs.confirm_mdp}
                                onChange={(e) => setInputs({ ...inputs, confirm_mdp: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className='label'>
                            <span className='text-sm font-medium text-gray-600'>Adresse</span>
                        </label>
                        <textarea
                            placeholder='Entrez votre adresse'
                            className='w-full text-sm input input-bordered h-24 rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200'
                            value={inputs.adresse}
                            onChange={(e) => setInputs({ ...inputs, adresse: e.target.value })}
                        />
                    </div>

                    <Link className='text-sm text-blue-600 hover:underline' to='/connexion'>
                        Vous avez déjà un compte?
                    </Link>

                    <div>
                        <button className='btn btn-block h-10 mt-4 border border-transparent bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-200'
                            disabled={loading}
                        >
                            {loading ? <span className="loading loading-dots loading-md"></span> : "Inscription"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Inscription;
