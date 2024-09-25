import { useState } from 'react';
import { ImProfile } from "react-icons/im";
import { CgProfile } from "react-icons/cg";
import BoutonDeconnexion from "./BoutonDeconnexion.jsx";
import { useAuthContext } from "../../context/UtilisateurAuthContext.jsx";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { AiFillProfile } from "react-icons/ai";


export const Navbar = () => {
    const { authUtilisateur } = useAuthContext();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    return (
        <div className="navbar bg-white text-neutral-content">
            <div className="navbar-start">

                <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="navbar-burger self-center">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle text-black">
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
                </button>
            </div>

            <div className="navbar-end">

                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-16 rounded-full">
                            {authUtilisateur && authUtilisateur.imgProfil ? (<img src={`${authUtilisateur.imgProfil}`} alt="imag profil" className="rounded-full w-full h-full max-w-xs md:max-w-md lg:max-w-lg border-4 border-blue-500 p-1 text-black" />) : (<CgProfile className="w-full h-full text-black" />)}
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow text-black">
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
            {mobileNavOpen && (
                <div className="navbar-menu fixed top-0 left-0 z-50 w-full h-full bg-coolGray-900 bg-opacity-50">
                    <div className="fixed top-0 left-0 bottom-0 w-full w-4/6 max-w-xs bg-white text-black">
                        <nav className="relative p-6 h-full overflow-y-auto">
                            <div className="flex flex-col justify-between h-full">
                                {/* <a className="inline-block" href="#">
                                    <img className="h-8" src="flex-ui-assets/logos/flex-ui-green-light.svg" alt="" />
                                </a> */}

                                <ul className="py-6 mt-4">
                                    <li>
                                        <Link className="flex items-center py-3 px-4 text-coolGray-500  transition-colors duration-1000 hover:text-white font-medium hover:bg-blue-500 rounded-md"
                                            to="/" >
                                            <FaHome className="mr-2" />
                                            <span>Accueil</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="flex items-center py-3 px-4 text-coolGray-500  transition-colors duration-1000 hover:text-white font-medium hover:bg-blue-500 rounded-md"
                                            to="/profil" >
                                            <AiFillProfile className="mr-2" />
                                            <span>Profil</span>
                                        </Link>
                                    </li>

                                </ul>
                                <div className="flex flex-wrap">
                                    {authUtilisateur ? (
                                        <div className="w-full mb-2">
                                            <div>
                                                <BoutonDeconnexion btnClass="inline-block py-2 px-4 w-full text-sm leading-5 text-coolGray-500 transition-colors duration-1000 hover:text-coolGray-900 hover:text-white bg-transparent font-medium text-center rounded-md text-black hover:bg-red-500 cursor-pointer" />
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-full">
                                                <div className="inline-block py-2 mb-2 px-4 w-full text-sm leading-5 text-black transition-colors duration-1000 hover:bg-green-600 hover:text-white font-medium text-center focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md">
                                                    <Link to="/connexion">Connexion</Link>
                                                </div>
                                            </div>
                                            <div className="w-full">
                                                <div className="inline-block py-2 px-4 w-full text-sm leading-5 text-white bg-blue-600 shadow-md transition-colors duration-1000 hover:bg-blue-700 font-medium text-center focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md">
                                                    <Link to="/inscription">Inscription</Link>
                                                </div>
                                            </div>
                                        </>
                                    )}


                                </div>
                            </div>
                        </nav>
                        <button onClick={() => setMobileNavOpen(false)} className="navbar-close absolute top-5 p-4 right-3">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.94004 6L11.14 1.80667C11.2656 1.68113 11.3361 1.51087 11.3361 1.33333C11.3361 1.1558 11.2656 0.985537 11.14 0.860002C11.0145 0.734466 10.8442 0.66394 10.6667 0.66394C10.4892 0.66394 10.3189 0.734466 10.1934 0.860002L6.00004 5.06L1.80671 0.860002C1.68117 0.734466 1.51091 0.663941 1.33337 0.663941C1.15584 0.663941 0.985576 0.734466 0.860041 0.860002C0.734505 0.985537 0.66398 1.1558 0.66398 1.33333C0.66398 1.51087 0.734505 1.68113 0.860041 1.80667L5.06004 6L0.860041 10.1933C0.797555 10.2553 0.747959 10.329 0.714113 10.4103C0.680267 10.4915 0.662842 10.5787 0.662842 10.6667C0.662842 10.7547 0.680267 10.8418 0.714113 10.9231C0.747959 11.0043 0.797555 11.078 0.860041 11.14C0.922016 11.2025 0.99575 11.2521 1.07699 11.2859C1.15823 11.3198 1.24537 11.3372 1.33337 11.3372C1.42138 11.3372 1.50852 11.3198 1.58976 11.2859C1.671 11.2521 1.74473 11.2025 1.80671 11.14L6.00004 6.94L10.1934 11.14C10.2554 11.2025 10.3291 11.2521 10.4103 11.2859C10.4916 11.3198 10.5787 11.3372 10.6667 11.3372C10.7547 11.3372 10.8419 11.3198 10.9231 11.2859C11.0043 11.2521 11.0781 11.2025 11.14 11.14C11.2025 11.078 11.2521 11.0043 11.286 10.9231C11.3198 10.8418 11.3372 10.7547 11.3372 10.6667C11.3372 10.5787 11.3198 10.4915 11.286 10.4103C11.2521 10.329 11.2025 10.2553 11.14 10.1933L6.94004 6Z" fill="#556987"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar;