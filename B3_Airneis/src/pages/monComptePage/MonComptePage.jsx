import React, { useContext, useEffect, useState } from 'react';
import { BsPencilSquare } from 'react-icons/bs';
import { TextField } from "@adobe/react-spectrum";
import { Link } from 'react-router-dom';
import { Data } from "../../services/api";
import { UserContext } from '../../context/UserProvider';
import { ToastQueue } from "@react-spectrum/toast";

const MonComptePage = () => {
    const { pullData } = useContext(UserContext);
    const [getUserName, setUserName] = useState([]);
    const [getUserMail, setUserMail] = useState([]);
    const [getUserPassword, setUserPassword] = useState([]);

    let userId;

    useEffect(() => {
        let userData = pullData("user");
        userId = userData.id;

        let data = {
            "table": "users",
            "id": userId
        };

        Data("panelAdmin", "getWhere", data).then(response => {
            if (response.success === true) {
                setUserName(response.data[0].full_name);
                setUserMail(response.data[0].email);
                setUserPassword(response.data[0].password);
            } else {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
    }, []);

    return (   
        <>
            <section className="comptePage"> 
                <h1 className="titreCompte">Paramètres de mon compte</h1>
                
                <div className="input-group">
                    <div className="input-container">
                        <TextField
                           label="Nom complet"
                           value={getUserName}
                            width={300}
                           disabled // To prevent editing the field
                        />
                    </div>
                </div>

                <div className="input-group">
                    <div className="input-container">
                        <TextField
                            label="E-mail"
                            value={getUserMail}
                            width={300}
                            disabled
                        />                     
                    </div>
                </div>

                <div className="input-group">
                    <div className="input-container">
                        <TextField
                            label="Mot de passe"
                            value={getUserPassword}
                            type="password"
                            width={300}
                            disabled
                        />                 
                    </div>
                </div>
                
                   <div className="input-group">
                        <h4 className="addresses-title">Mes adresses</h4>
                        <div className="bordered-button">
                            <Link to="/MonCompteAddresse" className="custom-link">
                                <button type="button" className="custom-button">
                                    Voir mes adresses
                                </button>
                            </Link>
                        </div>
                    </div>

                <div className="input-group">
                    <h4 className="payement-title">Méthode de payement</h4>
                        <div className="bordered-button">
                            <Link to="/MonComptePayment" className="custom-link">
                                <button type="button" className="custom-button">
                                Les méthodes de paiement
                                </button>
                            </Link>     
                    </div>
                </div>
        
                <div className="buttons-container">
                    <button className="submit" type="submit">Télécharger mes données</button>
                    <Link to="/monCompteEdit" className="submitModify">Modifier mes données</Link>
                    <button className="submitDelete" type="submit">Supprimer mon compte</button>
                </div>
            </section>
        </>
    );
}

export default MonComptePage;
