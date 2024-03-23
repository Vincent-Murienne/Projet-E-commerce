import { FaUser, FaBars } from "react-icons/fa"
import { FaX } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserProvider";
import { ToastQueue } from "@react-spectrum/toast";

const AdminHeader = () => {
    // We need to start by checking if the user is allowed to access to the panel Admin
    const { getMessage, user, login, logout, addMessage, pullUserData } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        pullUserData();
        if(user.isAdmin !== true){
            addMessage("error", "Vous n'êtes pas autorisé à accéder à cette page !");
            navigate("/");
        }
    });

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

    window.onscroll = () =>{
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

    useEffect(() => {
        // console.log(getMessage);
        if(getMessage && getMessage.type !== "")
        {
            if(getMessage.type === "success"){
                ToastQueue.positive(getMessage.body, {timeout: 5000});
            } else if(getMessage.type === "error"){
                ToastQueue.negative(getMessage.body, {timeout: 5000});
            }
            // setMessage({"type": "", "body": ""});
        }
    }, []);

    useEffect(() => {
        console.log(getMessage);
    }, [getMessage]);
    useEffect(() => {
        console.log(user);
    }, [user]);

    return (
        <>
            <header>
                <h1><Link to="/">Back to Àirneis</Link></h1>
                <nav>
                    <ul className="middle-nav">
                        <li><Link to="/" className="hover-underline-animation">Suivi des ventes</Link></li>
                        <li><Link to="/admin/HomePageManager" className="hover-underline-animation">Gestion de l'accueil</Link></li>
                        <li><Link to="/" className="hover-underline-animation">Catégories</Link></li>
                        <li><Link to="/" className="hover-underline-animation">Produits</Link></li>
                        <li><Link to="/admin/ImageManager" className="hover-underline-animation">Images</Link></li>
                    </ul>
                    <ul className="end-nav">
                        <div className="dropdown-user">
                            <li><FaUser size={20} className="scale_on_hover" onClick={UserMenuClicked}/></li>
                            <div className="dropdown-user-content">
                                <li><Link to="/" className="hover-underline-animation">Paramètre</Link></li>
                                <li><div className='separator'></div></li>
                                <li><Link to="/" className="hover-underline-animation" onClick={logout}>Se déconnecter</Link></li>
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
                                <li><Link to="/admin/HomePageManager" className="hover-underline-animation">Gestion de l'accueil</Link></li>
                                <li><Link to="/" className="hover-underline-animation">Catégories</Link></li>
                                <li><Link to="/" className="hover-underline-animation">Produits</Link></li>
                                <li><Link to="/admin/ImageManager" className="hover-underline-animation">Images</Link></li>
                                <li><div className="separator"></div></li>
                                <li><Link to="/" className="hover-underline-animation">Paramètre</Link></li>
                                <li><div className="separator"></div></li>
                                <li><Link to="/" className="hover-underline-animation" onClick={logout}>Se déconnecter</Link></li>
                            </div>
                        </div>
                    </ul>
                </nav>
            </header>
        </>
    );
};

export default AdminHeader;