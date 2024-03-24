import { createContext, useState } from "react";
import Cookies from "js-cookie";

const UserContext = createContext();

const UserProvider = ({ children }) => {

    const [ reloadData, setReloadData ] = useState(false);

    // Function to save data in cookies so it can live in the whole application even after a reload
    const saveData = (key, data) => {
        Cookies.set(key, JSON.stringify(data));
        changeReload();
    };

    // Function to pull the data associated to the key from the cookies
    const pullData = (key) => {
        let response = undefined;
        let storedData = Cookies.get(key);
        if(storedData !== undefined){
            let parsedData = JSON.parse(storedData);
            if(parsedData.isConnected !== false) {
                response = parsedData;
            }
        }

        return response;
    };

    // Function to remove the cookie associated to the key
    const removeData = (key) => {
        Cookies.remove(key);
    };

    // Function to force the reload of some useEffects
    const changeReload = () => {
        if(reloadData === true){
            setReloadData(false);
        } else{
            setReloadData(true);
        }
    };

    return (
        <>
        <UserContext.Provider value={{ pullData, saveData, removeData, reloadData }}>
            {children}
        </UserContext.Provider>
        </>
    );
};

export { UserContext, UserProvider };
