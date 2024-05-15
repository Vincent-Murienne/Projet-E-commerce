import { FaSearch, FaShoppingCart, FaUser, FaBars } from "react-icons/fa"
import { FaX } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserProvider";
import { ToastQueue } from "@react-spectrum/toast";


const Header = () => {
    const { pullData, removeData, reloadData } = useContext(UserContext);
    const [ user, setUser ] = useState({
        isConnected: false,
        isAdmin: false,
        id: "",
        email: ""
    });
    const [ isMenuOpen, setIsMenuOpen ] = useState(false);

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
    }, [reloadData]);

    // This function allows use to logout the user easily
    const handleLogout = () => {
        removeData("user");
        setUser({
            isConnected: false,
            isAdmin: false,
            id: "",
            email: ""
        });
        ToastQueue.positive("Vous vous êtes correctement déconnecté.", {timeout: 5000});
    };

    const [searchVisible, setSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const toggleSearchBar = () => {
        setSearchVisible(!searchVisible);
    };
    

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          navigateToProductPage();
        }
      };
    
      const navigateToProductPage = () => {
        window.location.href = `/product?search=${searchQuery}`;
      };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        console.log("Recherche soumise :", searchQuery);
    };

    return (
        <>
            <header>
                <h1>Àirneis</h1>
                <nav>
                    <ul className="middle-nav">
                        <li><Link to="/" className="hover-underline-animation">Accueil</Link></li>
                        <li><Link to="/categories" className="hover-underline-animation">Catégories</Link></li>
                        <li><Link to="/" className="hover-underline-animation">Contact</Link></li>
                        {
                            (user.isAdmin)
                            ?
                                <li><Link to="/admin/TrackSales" className="hover-underline-animation">Panel Admin</Link></li>
                            :
                                <></>
                        }
                    </ul>
                    <ul className="end-nav">
                        <li><FaSearch size={20} className="scale_on_hover" onClick={toggleSearchBar}/></li> 

                        {searchVisible && (
                            <li>
                                <form onSubmit={handleSearchSubmit}>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchInputChange}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Rechercher un produit ..."
                                    />                                          
                                </form>
                            </li>
                        )}

                        <li><Link to="/panier"><FaShoppingCart size={20}  className="scale_on_hover"/></Link></li>
                        <div className="dropdown-user">
                            <li><FaUser size={20} className="scale_on_hover" onClick={UserMenuClicked}/></li>
                            <div className="dropdown-user-content">
                                {
                                    (user.isConnected)
                                    ?
                                        <>
                                            <li><Link to="/" className="hover-underline-animation">Paramètre</Link></li>
                                            <li><div className='separator'></div></li>
                                            <li><Link to="/" className="hover-underline-animation" onClick={handleLogout}>Se déconnecter</Link></li>
                                        </>
                                    :
                                        <>
                                            <li><Link to="/login" className="hover-underline-animation">Se connecter</Link></li>
                                            <li><Link to="/register" className="hover-underline-animation">S'inscrire</Link></li>

                                        </>
                                }
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
                                <li><Link to="/" className="hover-underline-animation">Accueil</Link></li>
                                <li><Link to="/categories" className="hover-underline-animation">Catégories</Link></li>
                                <li><Link to="/" className="hover-underline-animation">Contact</Link></li>
                                {
                                    (user.isAdmin)
                                    ?
                                        <li><Link to="/admin/TrackSales" className="hover-underline-animation">Panel Admin</Link></li>
                                    :
                                        <></>
                                }
                                <li><div className="separator"></div></li>
                                {
                                    (user.isConnected)
                                    ?
                                        <>
                                            <li><Link to="/" className="hover-underline-animation">Paramètre</Link></li>
                                            <li><div className="separator"></div></li>
                                            <li><Link to="/" className="hover-underline-animation" onClick={handleLogout}>Se déconnecter</Link></li>
                                        </>
                                    :
                                        <>
                                            <li><Link to="/login" className="hover-underline-animation">Se connecter</Link></li>
                                            <li><Link to="/register" className="hover-underline-animation">S'inscrire</Link></li>
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
