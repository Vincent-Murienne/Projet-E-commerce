import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Data } from "../../services/api";
import { UserContext } from '../../context/UserProvider';
import { ToastQueue } from "@react-spectrum/toast";
import { Picker, Item } from '@react-spectrum/picker';
import { TextField } from "@adobe/react-spectrum";

const CheckoutPayment = () => {
    const { pullData } = useContext(UserContext);

    const [getUserPayment, setUserPayment] = useState([]);
    const [getSelectedPayment, setSelectedPayment] = useState(null); 
    const [getCardName, setCardName] = useState(undefined);
    const [getCardOwner, setCardOwner] = useState(undefined);
    const [getCardNumber, setCardNumber] = useState(undefined);
    const [getExpirationDate, setExpirationDate] = useState(undefined);
    const [getCvv, setCvv] = useState(undefined);
    const [getCardNameValidState, setCardNameValidState] = useState(1);
    const [getCardOwnerValidState, setCardOwnerValidState] = useState(1);
    const [getCardNumberValidState, setCardNumberValidState] = useState(1);
    const [getExpirationDateValidState, setExpirationDateValidState] = useState(1);
    const [getCvvValidState, setCvvValidState] = useState(1);

    useEffect(() => {
        getUserPayment.forEach(payment => {
            if(getSelectedPayment.toString() === payment.id.toString()){ 
                setCardName(payment.card_name);
                setCardOwner(payment.card_owner);
                setCardNumber(payment.card_number);
                setExpirationDate(payment.expiration_date);
                setCvv(payment.cvv);          
            }          
        }) 
    }, [getSelectedPayment]);

    const [getUserId, setUserId] = useState(undefined);
    let userId;
    const navigate = useNavigate();

    useEffect(() => {
        let userData = pullData("user");       
        if(userData === undefined){
            ToastQueue.negative("Veuillez vous connecter afin de pouvoir accéder à cette page.", {timeout: 5000});
            navigate("/");
            return;
        }

        userId = userData.id;

        const paymentData = {
            "table": "payments",
            "id": userId
        };

        Data("panelAdmin", "getAddresses", paymentData).then(response => {
            if (response.success === true) {
                setUserPayment(response.data);  
                setSelectedPayment(response.data[0].id.toString());
                setCardName(response.data[0].card_name);           
                setCardOwner(response.data[0].card_owner);
                setCardNumber(response.data[0].card_number);
                setExpirationDate(response.data[0].expiration_date);
                setCvv(response.data[0].cvv);
                setUserId(userId);
            } else {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
    }, []);


    return (   
        <>
            <div className="panelAdminAddElement">
                <form>
                    <h1 className="formTitle">Modifier vos méthodes de paiement</h1>

                    <div className="picker-container">
                        <Picker
                            label="Choisir vos moyens de paiement"
                            necessityIndicator="label"
                            isRequired
                            minWidth={300}
                            items={getUserPayment}                       
                            selectedKey={getSelectedPayment} 
                            onSelectionChange={selected => {setSelectedPayment(selected);                
                            }}
                        >
                            {item => <Item key={item.id}>{item.card_name}</Item>}
                        </Picker> 
                    </div> 

                    <div>                                               
                        {
                            (getCardNameValidState === 1)
                            ?
                            <TextField
                                label="Mode de payment"
                                onChange={setCardName}
                                value={getCardName} 
                                validationState="valid"
                                width={300}
                            />
                            :
                            <TextField
                                label="Mode de payment"
                                onChange={setCardName}
                                value={getCardName}  
                                validationState="invalid"
                                errorMessage="Veuillez entrer un nom de carte correct (entre 3 et 50 caractères)."
                                width={300}
                            />
                        }
                    </div>

                    <div>                                               
                        {
                            (getCardOwnerValidState === 1)
                            ?
                            <TextField
                                label="Titulaire de la carte"
                                onChange={setCardOwner}
                                value={getCardOwner} 
                                validationState="valid"
                                width={300}
                            />
                            :
                            <TextField
                                label="Titulaire de la carte"
                                onChange={setCardOwner}
                                value={getCardOwner} 
                                validationState="invalid"
                                errorMessage="Veuillez entrer un nom correct (entre 3 et 50 caractères)."
                                width={300}
                            />
                        }
                    </div>
                    <div>
                        {
                            (getCardNumberValidState === 1)
                            ?
                            <TextField
                                label="Numéro de carte"
                                onChange={setCardNumber}
                                value={getCardNumber}
                                validationState="valid"
                                width={300}
                            />
                            :
                            <TextField
                                label="Numéro de carte"
                                onChange={setCardNumber}
                                value={getCardNumber}
                                validationState="invalid"
                                errorMessage="Veuillez entrer un numéro de carte correct (16 numéros)."
                                width={300}
                            />
                        }
                    </div>

                    <div>
                        {
                            (getExpirationDateValidState === 1)
                            ?
                            <TextField
                                label="Date d'expiration"
                                onChange={setExpirationDate}
                                value={getExpirationDate}
                                validationState="valid"
                                width={300}
                            />
                            :
                            <TextField
                                label="Date d'expiration"
                                onChange={setExpirationDate}
                                value={getExpirationDate}
                                validationState="invalid"
                                errorMessage="Veuillez entrer une date valide."
                                width={300}
                            />
                        }
                    </div>

                    <div>
                        {
                            (getCvvValidState === 1)
                            ?
                            <TextField
                                label="Numéro de cvv"
                                onChange={setCvv}
                                value={getCvv}
                                validationState="valid"
                                width={300}
                            />
                            :
                            <TextField
                                label="Numéro de cvv"
                                onChange={setCvv}
                                value={getCvv}
                                validationState="invalid"
                                errorMessage="Veuillez entrer un cvv valide."
                                width={300}
                            />
                        }
                    </div> 
                    <></>
                    
                    <div className="buttons">
                        <Link to="/monCompte" className="form-btn-error">Annuler</Link>
                        <button type="submit" className="form-btn-success">Modifier</button>
                    </div>                 
                </form>                   
            </div>
        </>
    );
};

export default CheckoutPayment;
