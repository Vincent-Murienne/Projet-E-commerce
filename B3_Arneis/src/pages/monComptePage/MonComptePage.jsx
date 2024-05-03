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
                           disabled // Pour empêcher l'édition du champ
                        />
                        <div className="icon-container">
                            <Link to="/monCompteEdit">
                                <BsPencilSquare className="icon" size={25}/>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="input-group">
                    <div className="input-container">
                        <TextField
                            label="E-mail"
                            value={getUserMail}
                            width={300}
                        />
                        <div className="icon-container">
                            <BsPencilSquare className="icon" size={25}/>
                        </div>
                    </div>
                </div>

                <div className="input-group">
                    <div className="input-container">
                        <TextField
                            label="Mot de passe"
                            value={getUserPassword}
                            type="password"
                            width={300}
                        />
                        <div className="icon-container">
                            <BsPencilSquare className="icon" size={25}/>
                        </div>
                    </div>
                </div>

                <div className="input-group">
                    <div className="input-container">
                        <TextField
                            label="Adresse de livraison"
                            placeholder="Adresse de livraison"
                            width={300}
                        />
                        <div className="icon-container">
                            <BsPencilSquare className="icon" size={25}/>
                        </div>
                    </div>
                </div>

                <div className="input-group">
                    <div className="input-container">
                        <TextField
                            label="Adresse de facturation"
                            placeholder="Adresse de facturation"
                            width={300}
                        />
                        <div className="icon-container">
                            <BsPencilSquare className="icon" size={25}/>
                        </div>
                    </div>
                </div>

                <div className="input-group">
                    <div className="input-container">
                        <TextField
                            label="Méthode de payement"
                            placeholder="Méthode de payement"
                            width={300}
                        />
                        <div className="icon-container">
                            <BsPencilSquare className="icon" size={25}/>
                        </div>
                    </div>
                </div>
                <div className="buttons-container">
                    <button className="submit" type="submit">Télécharger mes données</button>
                    <button className="submitDelete" type="submit">Supprimer mon compte</button>
                </div>
            </section>
        </>
    );
}

export default MonComptePage;
