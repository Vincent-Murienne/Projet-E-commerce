import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Data } from '../../services/api';
import { ToastQueue } from '@react-spectrum/toast';
import { useTranslation } from 'react-i18next';

const ForgetPasswordPage = () => {
    // Setting use states
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let data = {
                "email": email
            };

            const response = await Data("loginRegister", "forgetPassword", data);
            if (response.success) {
                ToastQueue.positive(t("resetEmailSent"), { timeout: 5000 });
                navigate('/login');
            } else {
                ToastQueue.positive(t("resetEmailSent"), { timeout: 5000 });
            }
        } catch (error) {
            ToastQueue.negative(t("errorOccurred"), { timeout: 5000 });
        }
    };

    return (
        <div className="forget-password-page">
            <form onSubmit={handleSubmit}>
                <h2>{t("resetPassword")}</h2>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("enterEmail")}
                    required
                />
                <button type="submit">{t("sendResetEmail")}</button>
            </form>
        </div>
    );
};

export default ForgetPasswordPage;
