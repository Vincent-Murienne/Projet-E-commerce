import { useState } from 'react';
const ContactPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

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
            console.log(result);
            alert('Message envoyé avec succès !');
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message :', error);
            alert('Erreur lors de l\'envoi du message.');
        }
    };
    return (
        <div className="contact-container">
            <h1>Nous contacter</h1>
            <div className="contact-info">
                <p>Pour toute question ou information, notre Service Client est à votre disposition :</p>
                <ul>
                    <li>Par téléphone au <strong>+44 123 456 789</strong> (du lundi au vendredi de 9h à 18h).</li>
                    <li>Par e-mail à l'adresse <strong>airneis.commerce@gmail.com</strong></li>
                </ul>
            </div>
            <div className="contact-form">
                <h2>Formulaire de contact</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">E-mail :</label>
                    <input type="email" id="email" name="email" required onChange={handleChange}/>

                    <label htmlFor="subject">Sujet :</label>
                    <input type="text" id="subject" name="subject" required onChange={handleChange}/>

                    <label htmlFor="message">Message :</label>
                    <textarea id="message" name="message" rows="5" required onChange={handleChange}></textarea>

                    <button type="submit">Envoyer</button>
                </form>
            </div>
        </div>
    );
};

export default ContactPage;
