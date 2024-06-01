import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Data } from "../../services/api";
import { UserContext } from '../../context/UserProvider';
import { ToastQueue } from "@react-spectrum/toast";
import { Picker, Item } from '@react-spectrum/picker';
import { TextField } from "@adobe/react-spectrum";

const MonComptePayment = () => {
    const { pullData } = useContext(UserContext);

    const [getUserPayment, setUserPayment] = useState([]);
    const [getSelectedPayment, setSelectedPayment] = useState("0"); 
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
        if (getSelectedPayment === "0") {
            setCardName("");
            setCardOwner("");
            setCardNumber("");
            setExpirationDate("");
            setCvv("");
        } else {       
            const selectedPayment = getUserPayment.find(payment => payment.id.toString() === getSelectedPayment.toString());
            if (selectedPayment) {
                setCardName(selectedPayment.card_name);
                setCardOwner(selectedPayment.card_owner);
                setCardNumber(selectedPayment.card_number);
                setExpirationDate(selectedPayment.expiration_date);
                setCvv(selectedPayment.cvv);              
            }
        }
    }, [getSelectedPayment, getUserPayment]);

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
        setUserId(userData.id);

        userId = userData.id;

        const paymentData = {
            "table": "payments",
            "id": userId
        };

        Data("panelAdmin", "getAddresses", paymentData).then(response => {
            if (response.success === true) {
                setUserPayment(response.data);  
                if (response.data.length === 0) {
                    setSelectedPayment("0");
                } else {
                    setSelectedPayment(response.data[0].id.toString());  
                    setCardName(response.data[0].card_name);           
                    setCardOwner(response.data[0].card_owner);
                    setCardNumber(response.data[0].card_number);
                    setExpirationDate(response.data[0].expiration_date);
                    setCvv(response.data[0].cvv);
                    setUserId(userId);
                }
            } else {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
    }, []);

    useEffect(() => {
        if(getCardName !== undefined) {
            const fullNameRegex = /^[a-zA-ZÀ-ÿ\s\d-]{3,50}$/;
            if(fullNameRegex.test(getCardName)) {
                setCardNameValidState(1);
            } else {
                setCardNameValidState(2);
            }
        }
    }, [getCardName]);

    useEffect(() => {
        if(getCardOwner !== undefined) {
            const fullNameRegex = /^[a-zA-ZÀ-ÿ\s-]{3,50}$/;
            if(fullNameRegex.test(getCardOwner)) {
                setCardOwnerValidState(1);
            } else {
                setCardOwnerValidState(2);
            }
        }
    }, [getCardOwner]);
    
    useEffect(() => {
        if(getCardNumber !== undefined) {
            const phoneRegex = /^\d{16}$/; 
            if(phoneRegex.test(getCardNumber)) {
                setCardNumberValidState(1); 
            } else {
                setCardNumberValidState(2);
            }
        }
    }, [getCardNumber]);

    useEffect(() => {
        if (getExpirationDate !== undefined) {
            // Check if the expiration date is in the format MM/AAAA
            const expirationDateRegex = /^(\d{2})\/(\d{4})$/;
            const match = getExpirationDate.match(expirationDateRegex);
    
            if (match) {
                const expMonth = parseInt(match[1], 10);
                const expYear = parseInt(match[2], 10);
    
                if (expMonth <= 12) {
                    const expDate = new Date(expYear, expMonth, 0); 
    
                    const currentDate = new Date();
                    currentDate.setHours(0, 0, 0, 0); 
    
                    // Check if the expiration date is in the future
                    const isValidDate = expDate.getTime() > currentDate.getTime();
    
                    if (isValidDate) {
                        setExpirationDateValidState(1); // Valid state
    
                    } else {
                        setExpirationDateValidState(2); // Invalid state, date is in the past or invalid date
                    }
                } else {
                    setExpirationDateValidState(2); // Invalid state, month is greater than 12
                }
            } else {
                setExpirationDateValidState(2); // Invalid state, format is incorrect
            }
        }
    }, [getExpirationDate]);
    
    

    useEffect(() => {
        if(getCvv !== undefined) {        
            const cvvRegex = /^\d{3}$/; 
            if(cvvRegex.test(getCvv)) {
                setCvvValidState(1); 
            } else {
                setCvvValidState(2);
            }
        }
    }, [getCvv]);
    
    const FormSubmitted = async (e) => {
        e.preventDefault();

        if(getSelectedPayment === "0") { // If 'Add a new address' is selected
            if(getCardNameValidState === 1 && getCardOwnerValidState === 1 && getCardNumberValidState === 1 && getExpirationDateValidState === 1 && getCvvValidState === 1) {           
                let data = {
                    "table": "payments",
                    "data": {
                        "user_id": getUserId,
                        "card_name": getCardName,
                        "card_owner": getCardOwner,
                        "card_number": getCardNumber,
                        "expiration_date": getExpirationDate,
                        "cvv": getCvv,  
                    }             
                };
          
                Data("panelAdmin", "insert", data).then(response => {
                    if (response.success === true) {
                        ToastQueue.positive("Adresse ajoutée avec succès !", {timeout: 5000});
                        navigate("/monCompte");
                    } else {
                        ToastQueue.negative(response.error, {timeout: 5000});
                    }
                });
            } else {
                ToastQueue.negative("Veuillez remplir correctement tous les champs.", {timeout: 5000});
            }
        } else {
            if(getCardNameValidState === 1 && getCardOwnerValidState === 1 && getCardNumberValidState === 1 && getExpirationDateValidState === 1 && getCvvValidState === 1) {           
                let data = {
                    "table": "payments",
                    "id": getSelectedPayment,
                    "data": {
                        "card_name": getCardName,
                        "card_owner": getCardOwner,
                        "card_number": getCardNumber,
                        "expiration_date": getExpirationDate,
                        "cvv": getCvv,               
                    }             
                };
          
                Data("panelAdmin", "update", data).then(response => {
                    if (response.success === true) {
                        ToastQueue.positive("Modification réussie avec succès !", {timeout: 5000});
                        window.location.reload(); 
                    } else {
                        ToastQueue.negative(response.error, {timeout: 5000});
                    }
                });
            } else {
                ToastQueue.negative("Veuillez remplir correctement tous les champs.", {timeout: 5000});
            }
        }
    }

    const handleDelete = () => {
        const confirmed = window.confirm("Voulez-vous vraiment supprimer cette adresse ?");
        if (confirmed) {
            Data("panelAdmin", "deletePayment", {"id": getSelectedPayment })
                .then(response => {
                    if (response.success === true) {
                        ToastQueue.positive("Suppression réussie avec succès !", { timeout: 5000 });
                        window.location.reload();
                    } else {
                        ToastQueue.negative(response.error, { timeout: 5000 });
                    }
                });
        } 
    };

    const renderButtons = () => {
        if (getSelectedPayment === "0") {
            return (
                <>
                    <Link to="/monCompte" className="form-btn-error">Annuler</Link>
                    <button type="submit" className="form-btn-success">Ajouter</button>
                </>
            );
        } else {
            return (
                <>
                    <Link to="/monCompte" className="form-btn-error">Annuler</Link>
                    <button type="submit" className="form-btn-success">Modifier</button>
                    <button type="button" className="form-btn-delete" onClick={handleDelete}>Supprimer</button>
                </>
            );
        }
    };

    return (   
        <>
            <div className="monComptePageAdresse">
                <form onSubmit={FormSubmitted}>
                    <h1 className="formTitle">Modifier vos méthodes de paiement</h1>

                    <div className="picker-container">
                        <Picker
                            label="Choisir vos moyens de paiement"
                            necessityIndicator="label"
                            isRequired
                            minWidth={300}
                            items={[{ id: 0, card_name: "Ajouter une méthode de paiement" }, ...getUserPayment]}
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
                                errorMessage="Le format de la date d'expiration MM-AAAA"
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
                        {renderButtons()}
                    </div>                  
                </form>                   
            </div>
        </>
    );
};

export default MonComptePayment;
