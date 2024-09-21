import './App.css';
import Navbar from './components/Navbar';
import Connexion from '/src/pages/connexion/Connexion.jsx';
// import Inscription from '/src/pages/inscription/Inscription.jsx';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Conteneur pour le contenu qui doit être centré */}
      <div className="flex-grow flex items-center justify-center p-4">
        <Connexion />
        {/* <Inscription /> */}
      </div>
    </div>
  );
}

export default App;
