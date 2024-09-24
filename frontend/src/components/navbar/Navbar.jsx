import { ImProfile } from "react-icons/im";
import { CgProfile } from "react-icons/cg";
import BoutonDeconnexion from "./BoutonDeconnexion.jsx";
import { useAuthContext } from "../../context/UtilisateurAuthContext.jsx";
import { Link } from "react-router-dom";
export const Navbar = () => {
    const { authUtilisateur } = useAuthContext();
    return (
        <div className="navbar bg-neutral text-neutral-content">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li><a>Homepage</a></li>
                        <li><a>Portfolio</a></li>
                        <li><a>About</a></li>
                    </ul>
                </div>
            </div>

            <div className="navbar-end">
                <button className="btn btn-ghost btn-circle">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <CgProfile className="w-full h-full" />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        {authUtilisateur ? (
                            <>
                                <li className="inline-flex">
                                    <Link to={'/profil'}>
                                        <ImProfile className="mr-2" />  Profile
                                    </Link>
                                </li>
                                <li><BoutonDeconnexion /></li>
                            </>
                        ) : (
                            <li className="inline-flex">
                                <Link to="/connexion">Connexion</Link>
                                <Link to="/inscription">Inscription</Link>
                            </li>
                        )}

                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Navbar;