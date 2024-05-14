import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Data } from "../../services/api";
import { UserContext } from '../../context/UserProvider';
import { ToastQueue } from "@react-spectrum/toast";
import { Picker, Item } from '@react-spectrum/picker';
import { TextField } from "@adobe/react-spectrum";

const CheckoutAdresse = () => {
    const { pullData } = useContext(UserContext);
    const [getUserAddresses, setUserAddresses] = useState([]);
    const [getSelectedAddress, setSelectedAddress] = useState(null); 

    const [getAddressName, setAddressName] = useState(undefined);
    const [getFirstName, setFirstName] = useState(undefined);
    const [getLastName, setLastName] = useState(undefined);
    const [getAddress, setAddress] = useState(undefined);
    const [getCity, setCity] = useState(undefined);
    const [getZipCode, setZipCode] = useState(undefined);
    const [getRegion, setRegion] = useState(undefined);
    const [getCountry, setCountry] = useState(undefined);
    const [getPhone, setPhone] = useState(undefined);

    const [getAddressNameValidState, setAddressNameValidState] = useState(1);
    const [getFirstNameValidState, setFirstNameValidState] = useState(1);
    const [getLastNameValidState, setLastNameValidState] = useState(1);
    const [getAddressValidState, setAddressValidState] = useState(1);
    const [getCityValidState, setCityValidState] = useState(1);
    const [getZipCodeValidState, setZipCodeValidState] = useState(1);
    const [getRegionValidState, setRegionValidState] = useState(1);
    const [getCountryValidState, setCountryValidState] = useState(1);
    const [getPhoneValidState, setPhoneValidState] = useState(1);

    useEffect(() => {
        getUserAddresses.forEach(address => {
            if(getSelectedAddress.toString() === address.id.toString()){ 
                setAddressName(address.address_name);
                setFirstName(address.first_name);
                setLastName(address.last_name);
                setAddress(address.address);
                setCity(address.city);
                setZipCode(address.zip_code); 
                setRegion(address.region);
                setCountry(address.country);
                setPhone(address.phone_number);
            }          
        }) 
    }, [getSelectedAddress]);

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

        const addressData = {
            "table": "addresses",
            "id": userId
        };

        Data("panelAdmin", "getAddresses", addressData).then(response => {
            if (response.success === true) {
                setUserAddresses(response.data);  
                setSelectedAddress(response.data[0].id.toString());
                setAddressName(response.data[0].address_name);           
                setFirstName(response.data[0].first_name);
                setLastName(response.data[0].last_name);
                setAddress(response.data[0].address);
                setCity(response.data[0].city);
                setZipCode(response.data[0].zip_code); 
                setRegion(response.data[0].region);
                setCountry(response.data[0].country);
                setPhone(response.data[0].phone_number);
                setUserId(userId);
            } else {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
    }, []);

    useEffect(() => {
        if(getAddressName !== undefined) {
            const fullNameRegex = /^[a-zA-ZÀ-ÿ\s\d-]{5,50}$/;
            if(fullNameRegex.test(getAddressName)) {
                setAddressNameValidState(1);
            } else {
                setAddressNameValidState(2);
            }
        }
    }, [getAddressName]);

    useEffect(() => {
        if(getFirstName !== undefined) {
            const fullNameRegex = /^[a-zA-ZÀ-ÿ\s-]{3,50}$/;
            if(fullNameRegex.test(getFirstName)) {
                setFirstNameValidState(1);
            } else {
                setFirstNameValidState(2);
            }
        }
    }, [getFirstName]);

    useEffect(() => {
        if(getLastName !== undefined) {
            const fullNameRegex = /^[a-zA-ZÀ-ÿ\s-]{3,50}$/;
            if(fullNameRegex.test(getLastName)) {
                setLastNameValidState(1);
            } else {
                setLastNameValidState(2);
            }
        }
    }, [getLastName]);

    useEffect(() => {
        if(getAddress !== undefined) {
            const addressRegex = /^.{5,100}$/; 
            if(addressRegex.test(getAddress)) {
                setAddressValidState(1); 
            } else {
                setAddressValidState(2); 
            }
        }
    }, [getAddress]);

    useEffect(() => {
        if(getCity !== undefined) {
            const cityRegex = /^[a-zA-ZÀ-ÿ\s-]{3,50}$/;
            if(cityRegex.test(getCity)) {
                setCityValidState(1); 
            } else {
                setCityValidState(2); 
            }
        }
    }, [getCity]);
    
    useEffect(() => {
        if(getZipCode !== undefined) {
            const zipCodeRegex = /^\d{5}$/; 
            if(zipCodeRegex.test(getZipCode)) {
                setZipCodeValidState(1); 
            } else {
                setZipCodeValidState(2); 
            }
        }
    }, [getZipCode]);

    useEffect(() => {
        if(getRegion !== undefined) {
            const regionRegex = /^[a-zA-ZÀ-ÿ\s-]{3,50}$/; 
            if(regionRegex.test(getRegion)) {
                setRegionValidState(1); 
            } else {
                setRegionValidState(2); 
            }
        }
    }, [getRegion]);
    
    useEffect(() => {
        if(getCountry !== undefined) {
            const countryRegex = /^[a-zA-ZÀ-ÿ\s-]{3,50}$/; 
            if(countryRegex.test(getCountry)) {
                setCountryValidState(1); 
            } else {
                setCountryValidState(2); 
            }
        }
    }, [getCountry]);
    
    useEffect(() => {
        if(getPhone !== undefined) {
            const phoneRegex = /^\d{9}$/; 
            if(phoneRegex.test(getPhone)) {
                setPhoneValidState(1); 
            } else {
                setPhoneValidState(2);
            }
        }
    }, [getPhone]);
    
    const FormSubmitted = async (e) => {
        e.preventDefault();

        if(getFirstNameValidState === 1 && getLastNameValidState === 1 && getAddressValidState === 1 && getCityValidState === 1 && getZipCodeValidState === 1 && getRegionValidState === 1 && getCountryValidState === 1 && getPhoneValidState === 1) {           
            let data = {
                "table": "addresses",
                "id": getSelectedAddress,
                "data": {
                    "address_name": getAddressName,
                    "first_name": getFirstName,
                    "last_name": getLastName,
                    "address": getAddress,
                    "city": getCity,
                    "zip_code": getZipCode,
                    "region": getRegion,
                    "country": getRegion,
                    "phone_number": getPhone
                }             
            };
      
            Data("panelAdmin", "insert", data).then(response => {
                if (response.success === true)
                {
                    ToastQueue.positive("Création réussite avec succès !", {timeout: 5000});
                    navigate("/admin/CategoryManager");
                }
                else
                {
                    ToastQueue.negative(response.error, {timeout: 5000});
                }
            });
        } else {
            ToastQueue.negative("Veuillez remplir correctement tous les champs.", {timeout: 5000});
        }
    };

    return (   
        <>
            <div className="panelAdminAddElement">
            <form onSubmit={FormSubmitted}>
                    <h2 className="formTitle">Veuillez ajouter ou choisir une adresse de livraison</h2>

                    <div className="picker-container">
                        <Picker
                            label="Choisir une adresse"
                            necessityIndicator="label"
                            isRequired
                            minWidth={300}
                            items={getUserAddresses}                       
                            selectedKey={getSelectedAddress} 
                            onSelectionChange={selected => {setSelectedAddress(selected);                
                            }}
                        >
                            {item => <Item key={item.id}>{item.address_name}</Item>}
                        </Picker> 
                    </div> 

                    <div>                                               

                            <TextField
                                label="Nom d'adresse"
                                value={getAddressName} 
                                width={300}
                            />                         
                    </div>

                    <div>                                               
                            <TextField
                                label="Prénom"
                                value={getFirstName} 
                                width={300}
                            />                       
                    </div>
                    <div>
                        
                            <TextField
                                label="Nom"
                                value={getLastName}
                                width={300}
                            />
                    </div>

                    <div>
                            <TextField
                                label="Adresse"
                                value={getAddress}
                                width={300}
                            />
                    </div>

                    <div>
                            <TextField
                                label="Ville"
                                value={getCity}
                                width={300}
                            />
                    </div>

                    <div>
                       
                            <TextField
                                label="Code postal"
                                value={getZipCode}
                                width={300}
                            />
                    </div>
                    <div>
                            <TextField
                                label="Région"
                                value={getRegion}
                                width={300}
                            />
                    </div>
                    <div>
                      
                            <TextField
                                label="Pays"
                                value={getCountry}
                                width={300}
                            />
                    </div>

                    <div>
                            <TextField
                                label="Téléphone"
                                value={getPhone}
                                width={300}
                            />
                    </div>             
                    <></>
                    
                    <div className="buttons">
                        <Link to="/checkoutPage" className="form-btn-error">Annuler</Link>
                        <button type="submit" className="form-btn-success" onClick={FormSubmitted}>Confirmer</button>
                    </div>   
                    </form>                            
            </div>
        </>
    );
};

export default CheckoutAdresse;
