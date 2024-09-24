/* eslint-disable react/prop-types */
const InsForm = ({ inputs, setInputs, isInscription }) => {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Champ Nom */}
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

                {/* Champ Prénom */}
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

                {/* Champ Email */}
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
                {isInscription && (
                    <>
                        {/* Champ Mot de passe */}
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

                        {/* Champ Confirmation de mot de passe */}
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
                    </>
                )}


            </div>

            {/* Champ Adresse */}
            <div>
                <label className='label mt-6'>
                    <span className='text-sm font-medium text-gray-600'>Adresse</span>
                </label>
                <textarea
                    placeholder='Entrez votre adresse'
                    className='w-full text-sm input input-bordered h-24 rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200'
                    value={inputs.adresse}
                    onChange={(e) => setInputs({ ...inputs, adresse: e.target.value })}
                />
            </div>
        </>
    );
};

export default InsForm;
