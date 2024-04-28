import React from 'react';
import { BsPencilSquare } from 'react-icons/bs';


const MonComptePage = () => {
    return (   
        <>
            <section className="comptePage"> 
                <h1 className="titreCompte">Paramètres de mon compte</h1>

                <label><b>Nom complet</b></label>
                <input type="text" placeholder="Prénom"/>

                <label><b>E-mail</b></label>
                <input type="text" placeholder="Email"/>

                <div className="input-group">
                    <label><b>Mot de passe</b></label>
                    <div className="password-input">
                        <input type="password" placeholder="Mot de passe"/>
                        {/* Utilisez l'icône de modification ici */}
                        <BsPencilSquare className="edit-icon" />
                    </div>
                </div>

                <label><b>Adresse de livraison</b></label>
                <input type="text" placeholder="Adresse de livraison"/> 

                <label><b>Adresse de facturation</b></label>
                <input type="text" placeholder="Adresse de facturation"/> 

                <label><b>Méthode de payement</b></label>
                <input type="text" placeholder="Méthode de payement"/> 
                <br />

                <div className="buttons-container">
                    <button className="submit" type="submit">Télécharger mes données</button>
                    <button className="submitDelete" type="submit">Supprimer mon compte</button>
                </div>
            </section>
        </>
    );
}

export default MonComptePage;
