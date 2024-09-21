const Inscription = () => {
    return (
        <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
            <div className='h-full w-full p-6 bg-white rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                <h1 className='text-3xl font-semibold text-gray-800 text-center mb-6'>
                    Inscription
                </h1>

                <form className='space-y-6'>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className='label'>
                                <span className='text-sm font-medium text-gray-600'>Nom</span>
                            </label>
                            <input
                                type='text'
                                placeholder='Entrer votre nom'
                                className='w-full text-sm input input-bordered h-10 rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200'
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
                            />
                        </div>

                        <div>
                            <label className='label'>
                                <span className='text-sm font-medium text-gray-600'>Confirmation</span>
                            </label>
                            <input
                                type='password'
                                placeholder='Confirmer le mot de passe'
                                className='w-full text-sm input input-bordered h-10 rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200'
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
                        />
                    </div>

                    <a className='text-sm text-blue-600 hover:underline' href='#'>
                        Vous avez déjà un compte?
                    </a>

                    <div>
                        <button className='btn btn-block h-10 mt-4 border border-transparent bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-200'>
                            Inscription
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Inscription;
