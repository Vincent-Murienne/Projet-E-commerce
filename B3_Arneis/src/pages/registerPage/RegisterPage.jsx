import { useState } from 'react';
import { FaUser, FaRegEnvelope, FaLock, FaEye, FaEyeSlash} from "react-icons/fa"
import { IconContext } from "react-icons";
import { Link } from "react-router-dom";
import '../../assets/css/login-register.css';


const RegisterPage = () => {
    
  const [action, setAction] = useState('Inscription');

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
                  <FaUser />
                </IconContext.Provider>
                <input type='text' id="name" placeholder='Nom complet *' style={{ marginLeft: '15px' }}/>
              </div>
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
            <Link to= "/login" className="forgot-password">Déjà un compte ? <span>Connectez-vous</span></Link>
            <div className="submit-container">
              <button className="submit" type="submit">S'inscrire</button>
            </div>
          </div>
        </form>
      </div>
  );
}

export default RegisterPage


// <input type='password' id="confirm-password" placeholder='Confirmer le mot de passe'/>