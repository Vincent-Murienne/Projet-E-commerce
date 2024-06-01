import React from 'react';

const ContactPage = () => {
    return (
        <div className="contact-container">
            <h1>Nous contacter</h1>
            <div className="contact-info">
                <p>Pour toute question ou information, notre Service Client est à votre disposition :</p>
                <ul>
                    <li>Par téléphone au <strong>+44 123 456 789</strong> (du lundi au vendredi de 9h à 18h).</li>
                    <li>Par e-mail à l'adresse <strong>contact@airneis.com.</strong></li>
                </ul>
            </div>
            <div className="contact-form">
                <h2>Formulaire de contact</h2>
                <form>
                    <label htmlFor="email">E-mail :</label>
                    <input type="email" id="email" name="email" required />

                    <label htmlFor="subject">Sujet :</label>
                    <input type="text" id="subject" name="subject" required />

                    <label htmlFor="message">Message :</label>
                    <textarea id="message" name="message" rows="5" required></textarea>

                    <button type="submit">Envoyer</button>
                </form>
            </div>
        </div>
    );
};

export default ContactPage;
