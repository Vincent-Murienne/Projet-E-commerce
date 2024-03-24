import { useContext, useState } from 'react';
import { FaUser, FaRegEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { IconContext } from "react-icons";
import { useNavigate, Link } from "react-router-dom";
import { Data } from "../../services/api";
import { UserContext } from "../../context/UserProvider";
import { ToastQueue } from '@react-spectrum/toast';

const RegisterPage = () => {
  const { saveData } = useContext(UserContext);

  const [action, setAction] = useState('Inscription');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFullNameChange = (e) => {
    setFullName(e.target.value.toUpperCase());
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  // In this function we are going to perform multiple verification on each of the value passed into the form to see if it fits our restrictions. If it does we insert the new user into the database
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const fullNameRegex = /^[a-zA-ZÀ-ÿ\s-]{5,50}$/;
    if (!fullNameRegex.test(fullName)) {
      setError('Veuillez saisir un nom complet valide de 5 à 50 caractères.');
      return;
    }

    const emailRegex = /^[^\s@]{1,50}@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Veuillez saisir une adresse e-mail valide (maximum 50 caractères).');
      return;
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@#$%^&*()-_+=!]{12,30}$/;
    if (!passwordRegex.test(password)) {
      setError('Le mot de passe doit comporter au moins 12 caractères alphanumériques (maximum 30 caractères).');
      return;
    }

    if (!isChecked) {
      setError('Veuillez lire et accepter les mentions légales.');
      return;
    }

    try {
      let data = {
        "full_name": fullName,
        "email": email,
        "password": password
      };

      Data("loginRegister", "register", data).then(response => {
        if (response.success === true)
        {
          saveData("user", { isConnected: true, isAdmin: (response.user.role === "1") ? true : false, id: response.user.id, email: email });
          saveData("message", {type: "success", body: "Inscription réussite avec succès !"});
          navigate('/');
        }
        else
        {
          ToastQueue.negative(response.error, {timeout: 5000});
        }
      });
    } catch (error) {
      ToastQueue.negative(error, {timeout: 5000});
    }
  };

  return (
    <div className="body-login">
      <form onSubmit={handleRegister}>
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
              <input type='text' id="fullName" placeholder='Nom complet *' style={{ marginLeft: '15px' }} value={fullName} onChange={handleFullNameChange} />
            </div>
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
            <div className="input">
              <input type="checkbox" id="terms" checked={isChecked} onChange={handleCheckboxChange} />
              <label htmlFor="terms">J'ai lu et accepté les <Link to="/mentions">mentions légales</Link></label>
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <Link to="/login" className="forgot-password">Déjà un compte ? <span>Connectez-vous</span></Link>
          <div className="submit-container">
            <button className="submit" type="submit">S'inscrire</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
