import { FaUser, FaBars } from "react-icons/fa"
import { FaX } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserProvider";

const AdminHeader = () => {
    const {user, setUser} = useContext(UserContext);
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

    return (
        <>
            <header>
                <h1>Àrneis - back office</h1>
                <nav>
                    <ul className="middle-nav">
                        <li><Link to="/admin/homePage/SliderManager" className="hover-underline-animation">Gestion de l'accueil</Link></li>
                        <li><Link to="/" className="hover-underline-animation">Catégories</Link></li>
                        <li><Link to="/" className="hover-underline-animation">Produits</Link></li>
                        <li><Link to="/" className="hover-underline-animation">Utilisateurs</Link></li>
                    </ul>
                    <ul className="end-nav">
                        <li><Link to="/" className="hover-underline-animation">Retour au site</Link></li>
                        <div className="dropdown-user">
                            <li><FaUser size={20} className="scale_on_hover" onClick={UserMenuClicked}/></li>
                            <div className="dropdown-user-content">
                                <li><Link to="/" className="hover-underline-animation">Paramètre</Link></li>
                                <li><div className='separator'></div></li>
                                <li><Link to="/" className="hover-underline-animation">Se déconnecter</Link></li>
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
                                <li><Link to="/" className="hover-underline-animation">Gestion de l'accueil</Link></li>
                                <li><Link to="/" className="hover-underline-animation">Catégories</Link></li>
                                <li><Link to="/" className="hover-underline-animation">Produits</Link></li>
                                <li><Link to="/" className="hover-underline-animation">Utilisateurs</Link></li>
                                <li><div className="separator"></div></li>
                                <li><Link to="/" className="hover-underline-animation">Paramètre</Link></li>
                                <li><div className="separator"></div></li>
                                <li><Link to="/" className="hover-underline-animation">Se déconnecter</Link></li>
                            </div>
                        </div>
                    </ul>
                </nav>
            </header>
        </>
    );
};

export default AdminHeader;