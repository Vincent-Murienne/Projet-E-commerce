import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastQueue } from '@react-spectrum/toast';
import { useTranslation } from 'react-i18next';
import { passwordRegex } from '../../utils/regexes';

const ResetPasswordPage = () => {
  const { t } = useTranslation(); // Hook for translation
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { token } = useParams();
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
      setErrors(prevErrors => ({ ...prevErrors, password: t('passwordRequirements') }));
      return;
    }

    if (password !== confirmPassword) {
        ToastQueue.negative(t('passwordMismatch'), { timeout: 5000 });
        return;
    }

    try {
      const response = await fetch('http://localhost:8000/actions/loginRegister/resetPassword.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, password }),
        });

        const data = await response.json();
        if (data.success) {
            ToastQueue.positive(t('passwordUpdateSuccess'), { timeout: 5000 });
            navigate('/login');
        } else {
          ToastQueue.negative(t('invalidOrExpiredLink'), { timeout: 5000 });
        }
    } catch (error) {
        ToastQueue.negative(t('errorUpdatingPassword'), { timeout: 5000 });
    }
  };

  return (
    <div className="body-reset">
      <form onSubmit={handleSubmit}>
        <div className='container-reset'>
          <div className='header-reset'>
            <div className='text'>{t('createNewPassword')}</div>
            <div className='underline'></div>
          </div>
          <div className='inputs-reset'>
            <div className='input-group-reset'>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder={t('newPasswordPlaceholder')}
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
                placeholder={t('confirmPasswordPlaceholder')}
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
            <button className="submit-reset" type="submit">{t('submitButton')}</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
