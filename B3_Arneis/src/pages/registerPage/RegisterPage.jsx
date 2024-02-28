import { useState } from 'react';
import { FaUser, FaRegEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { IconContext } from "react-icons";
import { Link } from "react-router-dom";
import { postData } from "../../services/apiRegister"; // Assuming you have a function to send POST requests

const RegisterPage = () => {
  const [action, setAction] = useState('Inscription');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await postData("register", { full_name: fullName, email, password, apiKey: import.meta.env.VITE_API_KEY });
      if (response.success) {
        // Rediriger l'utilisateur ou effectuer une autre action en cas d'inscription réussie
      } else {
        setError(response.error);
      }
    } catch (error) {
      setError('Une erreur est survenue lors de l\'inscription.');
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
              <input type='text' id="fullName" placeholder='Nom complet *' style={{ marginLeft: '15px' }} value={fullName} onChange={(e) => setFullName(e.target.value)} />
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
