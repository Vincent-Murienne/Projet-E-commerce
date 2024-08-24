import { FaUser, FaBars } from "react-icons/fa"
import { FaX } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserProvider";
import { ToastQueue } from "@react-spectrum/toast";

const AdminHeader = () => {
    // We need to start by checking if the user is allowed to access to the panel Admin
    const { saveData, pullData, removeData, reloadData } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        let data = pullData("user");
        if(data.isAdmin !== true){
            saveData("message", {type: "error", body: "Vous n'êtes pas autorisé à accéder à cette page !"});
            navigate("/");
        }
    }, []);

    // Then we will set the user information and close the menus if they are opens when the data is being reloaded
    const [ user, setUser ] = useState({
        isConnected: false,
        isAdmin: false,
        id: ""
    });

    // This is used to close the navigation menu
    const closeMenus = () => {
        let dropdownBurgerContent = document.querySelector('.dropdown-burger-content');
        let dropdownUserContent = document.querySelector('.dropdown-user-content');
        if (dropdownBurgerContent.style.display === "block") {
            dropdownBurgerContent.style.display = "none";
            setIsMenuOpen(false);
        }
    
        if (dropdownUserContent.style.display === "block") {
            dropdownUserContent.style.display = "none";
        }
    };

    // This is used for debug reason, if we need to reload the data
    useEffect(()=>{
        closeMenus();
        let data = pullData("user");
        if(data !== undefined){
            if(user.id !== data.id){
                setUser(data);
            }
        }
    }, [reloadData]);

    // Those blocks of code allows us to show or hide the menus if the user clicks on it
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const MenuClicked = () => {
        let dropdownBurgerContent = document.querySelector(".dropdown-burger-content");
        if (dropdownBurgerContent.style.display === "block") {
            dropdownBurgerContent.style.display = "none";
            setIsMenuOpen(false);
        } else {
            dropdownBurgerContent.style.display = "block";
            setIsMenuOpen(true);
        }
    }

    const UserMenuClicked = () => {
        let dropdownuserContent = document.querySelector('.dropdown-user-content');
        if (dropdownuserContent.style.display === "block") {
            dropdownuserContent.style.display = "none";
        } else {
            dropdownuserContent.style.display = "block";
        }
    }

    // We want to close the menus if the user scrolls
    window.onscroll = () =>{
        closeMenus();
    };

    // We will to display the messages from the cookies if there are some
    useEffect(() => {
        let data = pullData("message");
        if(data !== undefined)
        {
            if(data.type === "success"){
                ToastQueue.positive(data.body, {timeout: 5000});
            } else if(data.type === "error"){
                ToastQueue.negative(data.body, {timeout: 5000});
            }
            removeData("message");
        }
    }, []);

    // This function allows use to logout the user easily
    const handleLogout = () => {
        removeData("user");
        setUser({
            isConnected: false,
            isAdmin: false,
            id: ""
        });
        ToastQueue.positive("Vous vous êtes correctement déconnecté.", {timeout: 5000});
    };

    return (
        <>
            <header>
                <h1><Link to="/">Back to Àirneis</Link></h1>
                <nav>
                    <ul className="middle-nav">
                        <li><Link to="/admin/TrackSales" className="hover-underline-animation">Suivi des ventes</Link></li>
                        <li><Link to="/admin/HomePageManager" className="hover-underline-animation">Gestion de l'accueil</Link></li>
                        <li><Link to="/admin/CategoryManager" className="hover-underline-animation">Catégories</Link></li>
                        <li><Link to="/admin/ProductManager" className="hover-underline-animation">Produits</Link></li>
                        <li><Link to="/admin/ImageManager" className="hover-underline-animation">Images</Link></li>
                        <li><Link to="/admin/UserManager" className="hover-underline-animation">Utilisateurs</Link></li>
                    </ul>
                    <ul className="end-nav">
                        <div className="dropdown-user">
                            <li><FaUser size={20} className="scale_on_hover" onClick={UserMenuClicked}/></li>
                            <div className="dropdown-user-content">
                                <li><Link to="/" className="hover-underline-animation">Paramètre</Link></li>
                                <li><div className='separator'></div></li>
                                <li><Link to="/" className="hover-underline-animation" onClick={handleLogout}>Se déconnecter</Link></li>
                            </div>
                        </div>
                        <div className="dropdown-burger">
                                {
                                    (isMenuOpen)
                                    ?
                                        <FaX size={20} className="scale_on_hover" onClick={MenuClicked}/>
                                    :
                                        <FaBars size={20} className="scale_on_hover" onClick={MenuClicked}/>
                                }
                            <div className="dropdown-burger-content">
                                <li><Link to="/admin/TrackSales" className="hover-underline-animation">Suivi des ventes</Link></li>
                                <li><Link to="/admin/HomePageManager" className="hover-underline-animation">Gestion de l'accueil</Link></li>
                                <li><Link to="/admin/CategoryManager" className="hover-underline-animation">Catégories</Link></li>
                                <li><Link to="/admin/ProductManager" className="hover-underline-animation">Produits</Link></li>
                                <li><Link to="/admin/ImageManager" className="hover-underline-animation">Images</Link></li>
                                <li><Link to="/admin/UserManager" className="hover-underline-animation">Utilisateurs</Link></li>
                                <li><div className="separator"></div></li>
                                <li><Link to="/" className="hover-underline-animation">Paramètre</Link></li>
                                <li><div className="separator"></div></li>
                                <li><Link to="/" className="hover-underline-animation" onClick={handleLogout}>Se déconnecter</Link></li>
                            </div>
                        </div>
                    </ul>
                </nav>
            </header>
        </>
    );
};

export default AdminHeader;