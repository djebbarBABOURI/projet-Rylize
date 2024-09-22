import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar/Navbar.jsx';
import Connexion from '/src/pages/connexion/Connexion.jsx';
import Inscription from '/src/pages/inscription/Inscription.jsx';
import { Toaster } from 'react-hot-toast';
import { useAuthContext } from "./context/UtilisateurAuthContext";
import Home from './pages/home/home';
function App() {
  const { authUtilisateur } = useAuthContext();
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Conteneur pour le contenu qui doit être centré */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div><Toaster /></div>
        <Routes>
          <Route path='/' element={authUtilisateur ? <Home /> : <Navigate to={"/connexion"} />} />
          <Route path='/inscription' element={authUtilisateur ? <Navigate to='/' /> : <Inscription />} />
          <Route path='/connexion' element={authUtilisateur ? <Navigate to='/' /> : <Connexion />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
