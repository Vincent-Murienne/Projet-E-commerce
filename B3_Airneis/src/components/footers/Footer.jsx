import { FaAngleRight, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa"
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';


const Footer = () => {

    const { t } = useTranslation();

    return(
        <>
            <footer>
                <div>
                    <p><Link to="/cguPage">{t('GCU')}</Link> - <Link to="/mentionsLegales">{t('legalInformation')}</Link> - <Link to="/airneisDesc">{t('aboutAirneis')}</Link></p>
                </div>
                <div className="reseaux">
                    <Link to="https://www.facebook.com/profile.php?id=61560438473857"><FaFacebookF className="scale_on_hover"/></Link>
                    <Link to="https://x.com/airneiscommerce"><FaTwitter className="scale_on_hover"/></Link>
                    <Link to="https://www.instagram.com/airneis.commerce/"><FaInstagram className="scale_on_hover"/></Link>
                    <Link to="https://www.linkedin.com/in/%C3%A0irneis-%C3%A0irneis-b16433310/"><FaLinkedin className="scale_on_hover"/></Link>
                </div>
            </footer>
        </>
    );
};

export default Footer;