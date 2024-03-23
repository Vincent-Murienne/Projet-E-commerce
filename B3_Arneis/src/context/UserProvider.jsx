import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ToastQueue } from "@react-spectrum/toast";

const UserContext = createContext();

const UserProvider = ({ children }) => {

    const [getMessage, setMessage] = useState({
        type: "",
        body: ""
    });

    const [user, setUser] = useState({
        isConnected: false,
        isAdmin: false,
        id: "",
        email: ""
    });

    const saveUserData = () => {
        Cookies.set("user", JSON.stringify(user));
    };

    const pullUserData = () => {
        let storedData = Cookies.get("user");
        if(storedData !== undefined){
            let parsedData = JSON.parse(storedData);
            if(parsedData.isConnected !== false) {
                setUser(parsedData);
            }
        }
    };

    // useEffect(() => {
    //     if(user.isConnected){
    //         saveUserData();
    //     } else {
    //         pullUserData();
    //     }
    //     console.log(user)
    // }, [user]);

    // Function to set the user data in our context application
    const login = (userData) => {
        setUser({
            isConnected: true,
            isAdmin: userData.isAdmin,
            id: userData.id,
            email: userData.email
        });
    };

    // Function to logout the user
    const logout = () => {
        Cookies.remove("user");
        setUser({
            isConnected: false,
            isAdmin: false,
            id: "",
            email: ""
        });
    };

    // Function to set a message that we need to show after a navigation on another page
    const addMessage = (type, body) => {
        setMessage({
            type: type,
            body: body
        });
    };

    return (
        <>
        <UserContext.Provider value={{ getMessage, user, login, logout, addMessage, pullUserData }}>
            {children}
        </UserContext.Provider>
        </>
    );
};

export { UserContext, UserProvider };
