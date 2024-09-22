import { useState } from "react";
import { Link } from "react-router-dom";
import useConnexion from "../../hooks/useConnexion";

export const Connexion = () => {
    const [email, setEmail] = useState("");
    const [mdp, setMdp] = useState("");
    const { loading, connexion } = useConnexion();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await connexion(email, mdp);
    };
    return (
        <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
            <div className='h-full w-full p-6 bg-white rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                <h1 className='text-3xl font-semibold text-gray-800 text-center mb-6'>
                    Connexion
                </h1>
                <form className='space-y-4' onSubmit={handleSubmit}>
                    <div>
                        <label className='label p-2'>
                            <span className='text-sm label-text'>Email</span>
                        </label>
                        <input
                            type='email'
                            placeholder='Entrer votre email'
                            className='w-full  text-sm  input input-bordered h-10 rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className='label p-2'>
                            <span className='text-sm label-text'>Mot de passe</span>
                        </label>
                        <input
                            type='password'
                            placeholder='Entrer votre mot de passe'
                            className='w-full text-sm  input input-bordered h-10 rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200'
                            value={mdp}
                            onChange={(e) => setMdp(e.target.value)}
                        />
                    </div>

                    <Link to='/inscription' className='text-sm text-blue-600 hover:underline hover:text-blue-700 mt-2 inline-block'>
                        Vous {"n'avez"} pas de compte ?
                    </Link>

                    <div>
                        <button className='btn btn-block h-10 mt-4 border border-transparent bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-200'
                            disabled={loading}
                        >
                            {loading ? <span className="loading loading-dots loading-md"></span> : "Connecter"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Connexion;
