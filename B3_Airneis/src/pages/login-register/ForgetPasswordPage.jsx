import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Data } from '../../services/api';
import { ToastQueue } from '@react-spectrum/toast';

const ForgetPasswordPage = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Implémentez la logique pour vérifier si l'email existe et envoyer l'email de réinitialisation
        try {
            let data = {
                "email": email
            };

            const response = await Data("loginRegister", "forgetPassword", data);
            console.log(response);
            if (response.success) {
                ToastQueue.positive("Un e-mail de réinitialisation a été envoyé.", { timeout: 5000 });
                navigate('/login');
            } else {
                ToastQueue.positive("Un e-mail de réinitialisation a été envoyé.", { timeout: 5000 });
            }
        } catch (error) {
        ToastQueue.negative("Une erreur est survenue.", { timeout: 5000 });
        }
    };

    return (
        <div className="forget-password-page">
            <form onSubmit={handleSubmit}>
                <h2>Réinitialiser le mot de passe</h2>
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre adresse e-mail"
                required
                />
                <button type="submit">Envoyer l'e-mail de réinitialisation</button>
            </form>
        </div>
    );
};

export default ForgetPasswordPage;