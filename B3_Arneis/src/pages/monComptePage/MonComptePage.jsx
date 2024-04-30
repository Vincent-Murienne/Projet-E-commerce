import React from 'react';
import { BsPencilSquare } from 'react-icons/bs';
import { TextField } from "@adobe/react-spectrum";
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";
import {useParams } from "react-router-dom";
import { Data } from "../../services/api";


const MonComptePage = () => {
   

const [getUsers, setUsers] = useState([]);
  const { userId } = useParams(); 
  
  // Retrieving the category ID from URL parameters
    let data = {
        "table": "users",
        "id": userId
    };

    useEffect(() => {
        Data("compte", "getUser", data).then(response => {
            if (response.success === true)
            {
                setUsers(response.data[0]);
            }
            else
            {
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
                            placeholder="Prénom"
                            width={300}
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
                            placeholder="Email"
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
                            placeholder="Mot de passe"
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
