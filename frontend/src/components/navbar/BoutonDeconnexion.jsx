import { IoLogOutOutline } from "react-icons/io5";
import useDeconnexion from "../../hooks/useDeconnexion.js";

const BoutonDeconnexion = () => {
    const { loading, deconnecter } = useDeconnexion();

    return (
        <button className="inline-flex items-center" onClick={deconnecter}>
            {!loading ? (
                <>
                    <IoLogOutOutline className="mr-2" /> Logout
                </>
            ) : (
                <span className="loading loading-dots loading-md"></span>
            )}
        </button>
    );
};
export default BoutonDeconnexion;
