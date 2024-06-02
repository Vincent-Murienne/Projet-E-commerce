import { FaAngleRight, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa"
import { Link } from "react-router-dom";

const Footer = () => {
    return(
        <>
            <footer>
                <div>
                    <p><Link to="/cguPage">CGU</Link> - <Link to="/mentionsLegales">Mentions légales</Link> - <Link to="/airneisDesc">A propos d'Airneis</Link></p>
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