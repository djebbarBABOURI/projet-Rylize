import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
	return useContext(AuthContext);
};

// eslint-disable-next-line react/prop-types
export const UtilisateurAuthContextProvider = ({ children }) => {
	const [authUtilisateur, setAuthUtilisateur] = useState(JSON.parse(localStorage.getItem("Auth-Utilisateur")) || null);

	return <AuthContext.Provider value={{ authUtilisateur, setAuthUtilisateur }}>{children}</AuthContext.Provider>;
};
