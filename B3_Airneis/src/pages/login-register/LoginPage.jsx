import { useContext, useState } from 'react';
import { FaRegEnvelope, FaLock, FaEye, FaEyeSlash} from "react-icons/fa"
import { IconContext } from "react-icons";
import { useNavigate, Link } from "react-router-dom";
import { Data } from '../../services/api';
import { UserContext } from "../../context/UserProvider";
import { ToastQueue } from '@react-spectrum/toast';

const LoginPage = () => {

  const { saveData } = useContext(UserContext);

  const [action, setAction] = useState('Connexion');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  //This function is called after the validation of the form. We will check the existance of this user and will log him if his credentials are matching.
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      let data = {
        "email": email,
        "password": password
      };

      Data("loginRegister", "login", data).then(response => {
        if (response.success === true){
          saveData("user", { isConnected: true, isAdmin: (response.user[0].role === "1" || response.user[0].role === 1) ? true : false, id: response.user[0].id, email: email });
          saveData("message", {type: "success", body: "Connexion réussite avec succès !"});
          navigate('/');
        } else{
          ToastQueue.negative(response.error, {timeout: 5000});
        }
      });
    } catch (error) {
      ToastQueue.negative(error, {timeout: 5000});
    }
  };

  return(
      <div className="body-login">
        <form onSubmit={handleLogin}>
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
                <input type='email' id="email" placeholder='E-mail *' style={{ marginLeft: '15px' }} value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className='input'>
                <IconContext.Provider value={{ size: '1.5em', style: { marginLeft: '20px' } }}>
                  <FaLock />
                </IconContext.Provider>
                <input type={showPassword ? 'text' : 'password'} id="password" placeholder='Mot de passe *' style={{ marginLeft: '15px' }} value={password} onChange={(e) => setPassword(e.target.value)} />
                <IconContext.Provider value={{ size: '1.5em', style: { marginRight: '20px' } }}>
                  {showPassword ? (<FaEyeSlash onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }} />) : (<FaEye onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }} />)}
                </IconContext.Provider>
              </div>
            </div>
            {error && <div className="error-message">{error}</div>}
            <Link to="/forgetpassword" className="forgot-password">Mot de passe oublié ?</Link>
            <Link to= "/register" className="forgot-password">Pas de compte ? <span>Inscrivez-vous</span></Link>
            <div className="submit-container">
              <button className="submit" type="submit">Se connecter</button>
            </div>
          </div>
        </form>
      </div>
    );
};

export default LoginPage;