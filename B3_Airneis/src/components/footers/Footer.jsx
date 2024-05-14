import { FaAngleRight, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa"
import { Link } from "react-router-dom";

const Footer = () => {
    return(
        <>
            <footer>
                <div>
                    <p><Link to="/">CGU</Link> - <Link to="/">Mentions légales</Link> - <Link to="/">Contact</Link></p>
                </div>
                <div className="reseaux">
                    <Link to="/"><FaFacebookF className="scale_on_hover"/></Link>
                    <Link to="/"><FaTwitter className="scale_on_hover"/></Link>
                    <Link to="/"><FaInstagram className="scale_on_hover"/></Link>
                    <Link to="/"><FaLinkedin className="scale_on_hover"/></Link>
                </div>
            </footer>
        </>
    );
};

export default Footer;