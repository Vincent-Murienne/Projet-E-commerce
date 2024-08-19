import { ToastQueue } from '@react-spectrum/toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const ContactPage = () => {
    const { t } = useTranslation();

    // Setting use states
    const [formData, setFormData] = useState({
        email: '',
        subject: '',
        message: ''
    });

    const navigate = useNavigate();

    // Handling form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/actions/reglementation/sendContact.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const result = await response.text();
            ToastQueue.positive(result, { timeout: 5000 });
            navigate("/");
        } catch (error) {
            ToastQueue.negative(error, { timeout: 5000 });
        }
    };
    return (
        <div className="contact-container">
            <h1>{t('contactUsHeader')}</h1>
            <div className="contact-info">
                <p>{t('contactInfoText')}</p>
                <ul>
                    <li>{t('contactPhone')} <strong>{t('tel')}</strong> {t('telInfo')}</li>
                    <li>{t('contactEmail')} <strong> {t('mail')}</strong></li>
                </ul>
            </div>
            <div className="contact-form">
                <h2>{t('contactFormHeader')}</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">{t('email')}</label>
                    <input type="email" id="email" name="email" required onChange={handleChange}/>

                    <label htmlFor="subject">{t('sujet')}</label>
                    <input type="text" id="subject" name="subject" required onChange={handleChange}/>

                    <label htmlFor="message">{t('message')}</label>
                    <textarea id="message" name="message" rows="5" required onChange={handleChange}></textarea>

                    <button type="submit">{t('envoie')}</button>
                </form>
            </div>
        </div>
    );
};

export default ContactPage;
