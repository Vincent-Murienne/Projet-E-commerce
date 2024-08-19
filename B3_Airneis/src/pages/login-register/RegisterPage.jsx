import { useContext, useState } from 'react';
import { FaUser, FaRegEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { IconContext } from "react-icons";
import { useNavigate, Link } from "react-router-dom";
import { Data } from "../../services/api";
import { UserContext } from "../../context/UserProvider";
import { ToastQueue } from '@react-spectrum/toast';
import { useTranslation } from 'react-i18next';
import { fullNameRegex, emailRegex, passwordRegex } from '../../utils/regexes';

const RegisterPage = () => {
  const { t } = useTranslation();
  const { saveData } = useContext(UserContext);

  // Setting use states
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    mentionsLegal: ''
  });
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  // Handle the change of visibility of the password
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form changes
  const handleFullNameChange = (e) => {
    setFullName(e.target.value.toUpperCase());
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  // In this function we are going to perform multiple verification on each of the value passed into the form to see if it fits our restrictions. If it does we insert the new user into the database
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({
      fullName: '',
      email: '',
      password: '',
      mentionsLegal: ''
    });

    if (!fullNameRegex.test(fullName)) {
      setErrors(prevErrors => ({ ...prevErrors, fullName: t('fullNameError') }));
      return;
    }

    if (!emailRegex.test(email)) {
      setErrors(prevErrors => ({ ...prevErrors, email: t('emailError') }));
      return;
    }

    if (!passwordRegex.test(password)) {
      setErrors(prevErrors => ({ ...prevErrors, password: t('passwordError') }));
      return;
    }

    if (!isChecked) {
      setErrors(prevErrors => ({ ...prevErrors, mentionsLegal: t('mentionsLegalError') }));
      return;
    }

    try {
      let data = {
        "full_name": fullName,
        "email": email,
        "password": password
      };

      Data("loginRegister", "register", data).then(response => {
        if (response.success === true) {
          saveData("user", { isConnected: true, isAdmin: (response.user.role === "1") ? true : false, id: response.user.id });
          saveData("message", { type: "success", body: t('registerSuccess') });
          navigate('/');
        } else {
          ToastQueue.negative(response.error, { timeout: 5000 });
        }
      });
    } catch (error) {
      ToastQueue.negative(error, { timeout: 5000 });
    }
  };

  return (
    <div className="body-login">
      <form onSubmit={handleRegister}>
        <div className='container'>
          <div className='header'>
            <div className='text'>{t("registration")}</div>
            <div className='underline'></div>
          </div>
          <div className='inputs'>
            <div className='input'>
              <IconContext.Provider value={{ size: '1.5em', style: { marginLeft: '20px' } }}>
                <FaUser />
              </IconContext.Provider>
              <input type='text' id="fullName" placeholder={t('fullNamePlaceholder')} style={{ marginLeft: '15px' }} value={fullName} onChange={handleFullNameChange} maxLength={30} />
            </div>
            {errors.fullName && <div className="error-message">{errors.fullName}</div>}
            <div className='input'>
              <IconContext.Provider value={{ size: '1.5em', style: { marginLeft: '20px' } }}>
                <FaRegEnvelope />
              </IconContext.Provider>
              <input type='email' id="email" placeholder={t('emailPlaceholder')} style={{ marginLeft: '15px' }} value={email} onChange={(e) => setEmail(e.target.value)} maxLength={50} />
            </div>
            {errors.email && <div className="error-message">{errors.email}</div>}
            <div className='input'>
              <IconContext.Provider value={{ size: '1.5em', style: { marginLeft: '20px' } }}>
                <FaLock />
              </IconContext.Provider>
              <input type={showPassword ? 'text' : 'password'} id="password" placeholder={t('passwordPlaceholder')} style={{ marginLeft: '15px' }} value={password} onChange={(e) => setPassword(e.target.value)} maxLength={30} />
              <IconContext.Provider value={{ size: '1.5em', style: { marginRight: '20px' } }}>
                {showPassword ? (<FaEyeSlash onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }} />) : (<FaEye onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }} />)}
              </IconContext.Provider>
            </div>
            {errors.password && <div className="error-message">{errors.password}</div>}
            <div className="mentions-legal">
              <input type="checkbox" id="terms" checked={isChecked} onChange={handleCheckboxChange} />
              <label htmlFor="terms">{t('legalTermsLabel')} <Link to="/mentions-legales">{t('mention')}</Link> *</label>
            </div>
            {errors.mentionsLegal && <div className="error-message">{errors.mentionsLegal}</div>}
          </div>
          <Link to="/login" className="forgot-password">{t('alreadyAccount')} <span>{t('loginLink')}</span></Link>
          <div className="submit-container">
            <button className="submit" type="submit">{t('registerButton')}</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
