import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar/Navbar.jsx';
import Connexion from '/src/pages/connexion/Connexion.jsx';
import Inscription from '/src/pages/inscription/Inscription.jsx';
import { Toaster } from 'react-hot-toast';
import { useAuthContext } from "./context/UtilisateurAuthContext";
import Home from './pages/home/Home.jsx';
import Profil from './pages/Profil/Profil.jsx';
import Budgets from './pages/budgets/Budgets.jsx';
import Categories from './pages/categories/Categories.jsx';
import Unfound from './pages/unfound/Unfound.jsx'; // Import de la page non trouvée

function App() {
  const { authUtilisateur } = useAuthContext();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className=''>
        <Toaster
          position="top-right"
          reverseOrder={false}
          containerStyle={{ zIndex: 1001 }}
        />
      </div>
      {/* Conteneur pour le contenu qui doit être centré */}
      <div className="h-full w-full flex-grow flex items-center justify-center p-4">
        <Routes>
          <Route path='/' element={authUtilisateur ? <Home /> : <Navigate to="/connexion" />} />
          <Route path='/inscription' element={authUtilisateur ? <Navigate to='/' /> : <Inscription />} />
          <Route path='/connexion' element={authUtilisateur ? <Navigate to='/' /> : <Connexion />} />
          <Route path='/budgets' element={authUtilisateur ? <Budgets /> : <Navigate to='/' />} />
          <Route path='/categories' element={authUtilisateur ? <Categories /> : <Navigate to='/' />} />
          <Route path='/profil' element={authUtilisateur ? <Profil /> : <Navigate to='/' />} />

          {/* Gestion des routes non existantes */}
          <Route path="*" element={<Unfound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
