import { useState } from 'react';
import { FaRegEnvelope, FaLock, FaEye, FaEyeSlash} from "react-icons/fa"
import { IconContext } from "react-icons";
import { Link } from "react-router-dom";
import '../../assets/css/login-register.css';

const LoginPage = () => {

  const [action, setAction] = useState('Connexion');

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return(
      <div className="body-login">
        <form>
          <div className='container'>
            <div className='header'>
              <div className='text'>{action}</div>
              <div className='underline'></div>
            </div>
            <div className='inputs'>
              <div className='input'>
                <IconContext.Provider value={{ size: '1.5em', style: { marginLeft: '20px' } }}>
                  <FaRegEnvelope />
                </IconContext.Provider>
                <input type='email' id="email" placeholder='E-mail *' style={{ marginLeft: '15px' }}/>
              </div>
              <div className='input'>
                <IconContext.Provider value={{ size: '1.5em', style: { marginLeft: '20px' } }}>
                  <FaLock />
                </IconContext.Provider>
                <input type={showPassword ? 'text' : 'password'} id="password" placeholder='Mot de passe *' style={{ marginLeft: '15px' }}/>
                <IconContext.Provider value={{ size: '1.5em', style: { marginRight: '20px' } }}>
                  {showPassword ? (<FaEyeSlash onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }} />) : (<FaEye onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }} />)}
                </IconContext.Provider>
              </div>
            </div>
            <Link to= "/register" className="forgot-password">Pas de compte ? <span>Inscrivez-vous</span></Link>
            <div className="submit-container">
              <button className="submit" type="submit">Se connecter</button>
            </div>
          </div>
        </form>
      </div>
    );
};

export default LoginPage


// label Champs obligatoires * avec une couleur rouge