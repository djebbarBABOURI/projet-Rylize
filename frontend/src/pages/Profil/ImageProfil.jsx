//import { useAuthContext } from "../../context/UtilisateurAuthContext";
import { CgProfile } from "react-icons/cg";
const ImageProfil = () => {
    // const { authUtilisateur } = useAuthContext();
    return (

        <div className="avatar">
            <div className="ring-primary ring-offset-base-100 w-28 rounded-full ring ring-offset-2">
                <CgProfile className="w-full h-full" />
            </div>
        </div>



    );
};

export default ImageProfil;
