import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from '../../context/UserProvider';
import { ToastQueue } from "@react-spectrum/toast";
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CheckoutConfirmer = () => {
    const { t } = useTranslation();
    // Setting use states
    const { pullData } = useContext(UserContext);
    const { orderId } = useParams();
    const navigate = useNavigate();

    // Check if user is connected. If not, redirect him to the home page with an error
    useEffect(() => {
        let userData = pullData("user"); // Get user information from the cookies   
        if (userData === undefined) {
            ToastQueue.negative(t("pleaseLogin"), { timeout: 5000 });
            navigate("/");
            return
        } 
    },); 

    return (
        <>
            <div className="monComptePageAdresse">
                <form>
                    <h1>{t('orderCompletedTitle')}</h1>
                    <h4>{t('thankYouMessage')}</h4>
                    <h4>{t('orderConfirmationMessage')} {orderId}. {t('suiteOrder')}</h4>
                    <Link to="/" className="btnProduit">{t('continueShopping')}</Link> 
                </form> 
            </div>
        </>
    );    
};

export default CheckoutConfirmer;