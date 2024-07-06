import { useState} from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastQueue } from '@react-spectrum/toast';
import { passwordRegex } from '../../utils/regexes';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { token } = useParams(); // Récupérer le token de l'URL
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    password: ''
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({
      password: '',
    });

    if (!passwordRegex.test(password)) {
      setErrors(prevErrors => ({ ...prevErrors, password: 'Le mot de passe doit comporter au moins 12 caractères alphanumériques' }));
      return;
    }

    if (password !== confirmPassword) {
        ToastQueue.negative("Les mots de passe ne correspondent pas.", { timeout: 5000 });
        return;
    }

    try {
      console.log(JSON.stringify({ token, password }));
      const response = await fetch('http://localhost:8000/actions/loginRegister/resetPassword.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, password }),
        });

        const data = await response.json();
        if (data.success) {
            ToastQueue.positive("Votre mot de passe a été modifié avec succès.", { timeout: 5000 });
            navigate('/login');
        } else {
          ToastQueue.negative("Lien expiré ou invalide.", { timeout: 5000 });
        }
    } catch (error) {
        console.error('Error:', error);
        ToastQueue.negative("Une erreur est survenue lors de la modification du mot de passe.", { timeout: 5000 });
    }
  };

  return (
    <div className="body-reset">
      <form onSubmit={handleSubmit}>
        <div className='container-reset'>
          <div className='header-reset'>
            <div className='text'>Créer un nouveau mot de passe</div>
            <div className='underline'></div>
          </div>
          <div className='inputs-reset'>
            <div className='input-group-reset'>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder='Nouveau mot de passe *'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="password-toggle-icon-reset" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className='input-group-reset'>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                placeholder='Confirmez le mot de passe *'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span className="password-toggle-icon-reset" onClick={toggleConfirmPasswordVisibility}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>
          <br />
          <div className="submit-container-reset">
            <button className="submit-reset" type="submit">Modifier le mot de passe</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordPage;