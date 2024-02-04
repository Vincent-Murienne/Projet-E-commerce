import { FaSearch, FaShoppingCart, FaUser, FaBars } from "react-icons/fa"
import { FaX } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserProvider";


const Header = () => {
    const {user, setUser} = useContext(UserContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const MenuClicked = (e) => {
        let dropdownBurgerContent = document.querySelector(".dropdown-burger-content");
        if (dropdownBurgerContent.style.display === "block") {
            dropdownBurgerContent.style.display = "none";
            setIsMenuOpen(false);
        } else {
            dropdownBurgerContent.style.display = "block";
            setIsMenuOpen(true);
        }
    }

    const UserMenuClicked = (e) => {
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
                <h1>Àrneis</h1>
                <nav>
                    <ul className="middle-nav">
                        <li><Link to="/" className="hover-underline-animation">Accueil</Link></li>
                        <li><Link to="/" className="hover-underline-animation">Catégories</Link></li>
                        <li><Link to="/" className="hover-underline-animation">Produits</Link></li>
                        <li><Link to="/" className="hover-underline-animation">Contact</Link></li>
                    </ul>
                    <ul className="end-nav">
                        <li><Link to="/"><FaSearch size={20} className="scale_on_hover"/></Link></li>
                        <li><Link to="/"><FaShoppingCart size={20}  className="scale_on_hover"/></Link></li>
                        <div className="dropdown-user">
                            <li><Link to="/"><FaUser size={20} className="scale_on_hover" onClick={UserMenuClicked}/></Link></li>
                            <div className="dropdown-user-content">
                                {
                                    (user.isConnected)
                                    ?
                                        <>
                                            <li><Link to="/" className="hover-underline-animation">Paramètre</Link></li>
                                            <li><div class='separator'></div></li>
                                            <li><Link to="/" className="hover-underline-animation">Se déconnecter</Link></li>
                                        </>
                                    :
                                        <>
                                            <li><Link to="/" className="hover-underline-animation">Se connecter</Link></li>
                                            <li><Link to="/" className="hover-underline-animation">S'inscrire</Link></li>
                                        </>
                                }
                            </div>
                        </div>
                        <div className="dropdown-burger">
                            <li><Link to="/">
                                {
                                    (isMenuOpen)
                                    ?
                                        <FaX size={20} className="scale_on_hover rotate" onClick={MenuClicked}/>
                                    :
                                        <FaBars size={20} className="scale_on_hover" onClick={MenuClicked}/>
                                }
                                </Link></li>
                            <div className="dropdown-burger-content">
                                <li><Link to="/" className="hover-underline-animation">Accueil</Link></li>
                                <li><Link to="/" className="hover-underline-animation">Catégories</Link></li>
                                <li><Link to="/" className="hover-underline-animation">Produits</Link></li>
                                <li><Link to="/" className="hover-underline-animation">Contact</Link></li>
                                <li><div className="separator"></div></li>
                                {
                                    (user.isConnected)
                                    ?
                                        <>
                                            <li><Link to="/" className="hover-underline-animation">Paramètre</Link></li>
                                            <li><div className="separator"></div></li>
                                            <li><Link to="/" className="hover-underline-animation">Se déconnecter</Link></li>
                                        </>
                                    :
                                        <>
                                            <li><Link to="/" className="hover-underline-animation">Se connecter</Link></li>
                                            <li><Link to="/" className="hover-underline-animation">S'inscrire</Link></li>
                                        </>
                                }
                            </div>
                        </div>
                    </ul>
                </nav>
            </header>
        </>
    );
};

export default Header;