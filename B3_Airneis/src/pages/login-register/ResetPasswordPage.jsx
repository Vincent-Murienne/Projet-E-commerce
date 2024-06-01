import { useState, useEffect } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const { token } = useParams(); // Récupérer le token de l'URL
  const navigate = useNavigate();


  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch('http://localhost:8000/actions/loginRegister/verifyToken.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (data.success) {
          setIsValidToken(true);
        } else {
          setErrorMessage(data.message || 'Le token est invalide ou a expiré.');
          navigate('/login'); // Rediriger l'utilisateur si le token n'est pas valide
        }
      } catch (error) {
        setErrorMessage('Une erreur est survenue lors de la vérification du token.');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        alert('Les mots de passe ne correspondent pas.');
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
            alert('Votre mot de passe a été modifié avec succès.');
            navigate('/login');
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Une erreur est survenue lors de la modification du mot de passe.');
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
            <div className='input-group'>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder='Nouveau mot de passe *'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className='input-group'>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                placeholder='Confirmez le mot de passe *'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span className="password-toggle-icon" onClick={toggleConfirmPasswordVisibility}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
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