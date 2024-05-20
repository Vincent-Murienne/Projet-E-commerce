import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from '../../context/UserProvider';
import { ToastQueue } from "@react-spectrum/toast";

const CheckoutConfirmer = () => {
    const { pullData } = useContext(UserContext);
    const [userId, setUserId] = useState(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        let userData = pullData("user");
        if (userData === undefined) {
            ToastQueue.negative("Veuillez vous connecter afin de pouvoir accéder à cette page.", { timeout: 5000 });
            navigate("/");
            return
        } 
    },); 

    return (
        <>
        <div className="monComptePageAdresse">
                <form>
                    <h1>Commande effectuée</h1>
                    <h4>Merci de votre achat !</h4>
                    <h4>Votre commande a bien été enregistrée sous le numéro XXXXXX. Vous pouvez suivre son état depuis votre espace client.</h4>
                    <Link to="/" className="btnProduit">Continuer mes achats</Link> 
           </form> 
                             
        </div>

        </>
    );
};

export default CheckoutConfirmer;