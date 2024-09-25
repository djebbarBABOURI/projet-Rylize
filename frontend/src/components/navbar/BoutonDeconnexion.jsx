import useDeconnexion from "../../hooks/useDeconnexion.js";
import { RiLogoutBoxRFill } from "react-icons/ri";


// eslint-disable-next-line react/prop-types
const BoutonDeconnexion = ({ btnClass }) => {
    const { loading, deconnecter } = useDeconnexion();

    return (
        <button className={`inline-flex items-center ${btnClass}`} onClick={deconnecter}>
            {!loading ? (
                <>
                    <RiLogoutBoxRFill className="mr-2" /> Logout
                </>
            ) : (
                <span className="loading loading-dots loading-md"></span>
            )}
        </button>
    );
};
export default BoutonDeconnexion;
