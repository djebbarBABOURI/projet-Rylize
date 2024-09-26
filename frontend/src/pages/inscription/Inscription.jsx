import { useState } from "react";
import { Link } from "react-router-dom";
import useInscription from "../../hooks/useInscription.js";
import InsForm from "./InsForm.jsx";
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
        await inscription(inputs);
    }
    return (
        <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
            <div className='h-full w-full p-6 bg-white rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                <h1 className='text-3xl font-semibold text-gray-800 text-center mb-6'>
                    Inscription
                </h1>

                <form className='space-y-6' onSubmit={handleSubmit}>

                    <InsForm inputs={inputs} setInputs={setInputs} isInscription={true} />
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
