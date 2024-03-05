import { createContext, useState } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        isConnected: false,
        id: "",
        email: ""
    });

    // Fonction pour connecter l'utilisateur
    const login = (userData) => {
        setUser({
            isConnected: true,
            id: userData.id,
            email: userData.email
        });
    };

    // Fonction pour déconnecter l'utilisateur
    const logout = () => {
        setUser({
            isConnected: false,
            id: "",
            email: ""
        });
    };

    return (
        <>
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
        </>
    );
};

export { UserContext, UserProvider };
