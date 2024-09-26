// src/pages/Unfound/Unfound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Unfound = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="text-lg mt-4">Page non trouvée</p>
            <Link to={"/"}><p className="text-sm mt-4">Retour à {"l'accueil"}</p></Link>
        </div>
    );
};

export default Unfound;
