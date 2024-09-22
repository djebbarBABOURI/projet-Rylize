import { useAuthContext } from "../../context/UtilisateurAuthContext";
import BoutonDeconnexion from "../../components/navbar/BoutonDeconnexion.jsx";
const Home = () => {
    const { authUtilisateur } = useAuthContext();
    return (
        <div>
            Bonjour {authUtilisateur.nom}
            <BoutonDeconnexion />
        </div>

    );
};

export default Home;
