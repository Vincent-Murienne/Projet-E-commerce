import React, { useContext, useEffect, useState } from 'react';
import { BsPencilSquare } from 'react-icons/bs';
import { TextField } from "@adobe/react-spectrum";
import { Link } from 'react-router-dom';
import { Data } from "../../services/api";
import { UserContext } from '../../context/UserProvider';
import { ToastQueue } from "@react-spectrum/toast";

const Checkout = () => {

    return (   
        <>
            <section className="comptePage"> 
                <h1 className="titreCompte">Récapitulatif de la commande</h1>               
                   <div className="input-group">
                        <h4 className="addresses-title">Adresse de livraison</h4>
                        <div className="bordered-button">
                            <Link to="/CheckoutAdresse" className="custom-link">
                                <button type="button" className="custom-button">
                                    choisir l'adresse de livraison
                                </button>
                            </Link>
                        </div>
                    </div>

                <div className="input-group">
                    <h4 className="payement-title">Méthode de payement</h4>
                        <div className="bordered-button">
                            <Link to="/CheckoutPayment" className="custom-link">
                                <button type="button" className="custom-button">
                                chosir la méthode de paiement
                                </button>
                            </Link>     
                    </div>
                </div>
        
                {/* <div className="buttons-container">
                    <button className="submit" type="submit">Télécharger mes données</button>
                    <Link to="/monCompteEdit" className="submitModify">Modifier mes données</Link>
                    <button className="submitDelete" type="submit">Supprimer mon compte</button>
                </div> */}
            </section>
        </>
    );
}

export default Checkout;
