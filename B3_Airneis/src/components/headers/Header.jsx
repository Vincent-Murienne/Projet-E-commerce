import { FaSearch, FaShoppingCart, FaUser, FaBars } from "react-icons/fa"
import { FaX } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserProvider";
import { ToastQueue } from "@react-spectrum/toast";
import LanguageSwitcher from '../../utils/LanguageSwitcher';
import i18n from '../../utils/i18n';
import { useTranslation } from 'react-i18next';

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
            window.location.href = `/product?search=${searchQuery}`;
        }
    };

    const { t } = useTranslation();

    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

    return (
        <>
            <header>
                <h1>Àirneis</h1>
                <nav>
                    <ul className="middle-nav">
                        <li><Link to="/" className="hover-underline-animation">{t('home')}</Link></li>
                        <li><Link to="/categories" className="hover-underline-animation">{t('categories')}</Link></li>
                        <li><Link to="/contactPage" className="hover-underline-animation">{t('contact')}</Link></li>
                        {
                            (user.isAdmin)
                            ?
                                <li><Link to="/admin/TrackSales" className="hover-underline-animation">{t('adminPanel')}</Link></li>
                            :
                                <></>
                        }
                    </ul>
                    <ul className="end-nav">

                    <div className="nav-display-none">
                        <li>
                            <LanguageSwitcher
                                selectedLanguage={selectedLanguage}
                                onLanguageChange={setSelectedLanguage}
                            />
                        </li>
                    </div>
                        
                        <li><FaSearch size={20} className="scale_on_hover" onClick={toggleSearchBar}/></li> 

                        {searchVisible && (
                            <li>
                                <form>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchInputChange}
                                        onKeyPress={handleKeyPress}
                                        placeholder={t('productSearch')}
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
                                            <li><Link to="/monComptePage" className="hover-underline-animation">{t('myAccount')}</Link></li>
                                            <li><div className='separator'></div></li>
                                            <li><Link to="/" className="hover-underline-animation" onClick={handleLogout}>{t('logout')}</Link></li>
                                        </>
                                    :
                                        <>
                                            <li><Link to="/login" className="hover-underline-animation">{t('login')}</Link></li>
                                            <li><Link to="/register" className="hover-underline-animation">{t('register')}</Link></li>

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
                                <li>
                                    <LanguageSwitcher
                                        selectedLanguage={selectedLanguage}
                                        onLanguageChange={setSelectedLanguage}
                                    />
                                </li>
                                <li><div className="separator"></div></li>
                                <li><Link to="/" className="hover-underline-animation">{t('home')}</Link></li>
                                <li><Link to="/categories" className="hover-underline-animation">{t('categories')}</Link></li>
                                <li><Link to="/contactPage" className="hover-underline-animation">{t('contact')}</Link></li>
                                {
                                    (user.isAdmin)
                                    ?
                                        <li><Link to="/admin/TrackSales" className="hover-underline-animation">{t('adminPanel')}</Link></li>
                                    :
                                        <></>
                                }
                                <li><div className="separator"></div></li>
                                {
                                    (user.isConnected)
                                    ?
                                        <>
                                            <li><Link to="/monComptePage" className="hover-underline-animation">{t('myAccount')}</Link></li>
                                            <li><div className="separator"></div></li>
                                            <li><Link to="/" className="hover-underline-animation" onClick={handleLogout}>{t('logout')}</Link></li>
                                        </>
                                    :
                                        <>
                                            <li><Link to="/login" className="hover-underline-animation">{t('login')}</Link></li>
                                            <li><Link to="/register" className="hover-underline-animation">{t('register')}</Link></li>
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
