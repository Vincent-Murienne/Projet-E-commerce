import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Data } from "../../services/api";
import { UserContext } from '../../context/UserProvider';
import { ToastQueue } from "@react-spectrum/toast";
import { Picker, Item } from '@react-spectrum/picker';
import { TextField } from "@adobe/react-spectrum";

const MonCompteAdresse = () => {
    const { pullData } = useContext(UserContext);
    const [getUserAddresses, setUserAddresses] = useState([]);
    const [getSelectedAddress, setSelectedAddress] = useState("0"); 
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
        if (getSelectedAddress === "0") {
            setAddressName("");
            setFirstName("");
            setLastName("");
            setAddress("");
            setCity("");
            setZipCode("");
            setRegion("");
            setCountry("");
            setPhone("");
        } else {       
            const selectedAddress = getUserAddresses.find(address => address.id.toString() === getSelectedAddress.toString());
            if (selectedAddress) {
                setAddressName(selectedAddress.address_name);
                setFirstName(selectedAddress.first_name);
                setLastName(selectedAddress.last_name);
                setAddress(selectedAddress.address);
                setCity(selectedAddress.city);
                setZipCode(selectedAddress.zip_code);
                setRegion(selectedAddress.region);
                setCountry(selectedAddress.country);
                setPhone(selectedAddress.phone_number);
            }
        }
    }, [getSelectedAddress, getUserAddresses]);

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

        const addressData = {
            "table": "addresses",
            "id": userId
        };

        Data("panelAdmin", "getAddresses", addressData).then(response => {
            if (response.success === true) {
                setUserAddresses(response.data);  
                if (response.data.length === 0) {
                    setSelectedAddress("0");
                } else {
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
                }
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
            const phoneRegex = /^\d{10}$/; 
            if(phoneRegex.test(getPhone)) {
                setPhoneValidState(1); 
            } else {
                setPhoneValidState(2);
            }
        }
    }, [getPhone]);
    
    const FormSubmitted = async (e) => {
        e.preventDefault();

        if(getSelectedAddress === "0") { // If 'Add a new address' is selected
            if(getFirstNameValidState === 1 && getLastNameValidState === 1 && getAddressValidState === 1 && getCityValidState === 1 && getZipCodeValidState === 1 && getRegionValidState === 1 && getCountryValidState === 1 && getPhoneValidState === 1) {           
                let data = {
                    "table": "addresses",
                    "data": {
                        "user_id": getUserId,
                        "address_name": getAddressName,
                        "first_name": getFirstName,
                        "last_name": getLastName,
                        "address": getAddress,
                        "city": getCity,
                        "zip_code": getZipCode,
                        "region": getRegion,
                        "country": getCountry,
                        "phone_number": getPhone
                    }             
                };
          
                Data("panelAdmin", "insert", data).then(response => {
                    if (response.success === true) {
                        ToastQueue.positive("Adresse ajoutée avec succès !", {timeout: 5000});
                        navigate("/monCompteParametres");
                    } else {
                        ToastQueue.negative(response.error, {timeout: 5000});
                    }
                });
            } else {
                ToastQueue.negative("Veuillez remplir correctement tous les champs.", {timeout: 5000});
            }
        } else { // If an existing address is selected, then it's an update
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
                        "country": getCountry,
                        "phone_number": getPhone
                    }             
                };
          
                Data("panelAdmin", "update", data).then(response => {
                    if (response.success === true) {
                        ToastQueue.positive("Modification réussie avec succès !", {timeout: 5000});
                        navigate("/monCompteParametres");
                    } else {
                        ToastQueue.negative(response.error, {timeout: 5000});
                    }
                });
            } else {
                ToastQueue.negative("Veuillez remplir correctement tous les champs.", {timeout: 5000});
            }
        }
    };

    const handleDelete = () => {
        const confirmed = window.confirm("Voulez-vous vraiment supprimer cette adresse ?");
        if (confirmed) {
            Data("panelAdmin", "deleteAddress", {"id": getSelectedAddress })
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
        if (getSelectedAddress === "0") {
            return (
                <>
                    <Link to="/monCompteParametres" className="form-btn-error">Annuler</Link>
                    <button type="submit" className="form-btn-success">Ajouter</button>
                </>
            );
        } else {
            return (
                <>
                    <Link to="/monCompteParametres" className="form-btn-error">Annuler</Link>
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
                    <h1 className="formTitle">Modifier votre adresse</h1>
                    <div className="picker-container">
                        <Picker
                            label="Choisir une adresse"
                            necessityIndicator="label"
                            isRequired
                            minWidth={300}
                            items={[{ id: 0, address_name: "Ajouter une nouvelle adresse" }, ...getUserAddresses]}
                            selectedKey={getSelectedAddress} 
                            onSelectionChange={selected => setSelectedAddress(selected)}
                        >
                            {item => <Item key={item.id}>{item.address_name}</Item>}
                        </Picker>

                    </div> 
                    <div>                                               
                        {
                            (getAddressNameValidState === 1)
                            ?
                            <TextField
                                label="Nom d'adresse"
                                onChange={setAddressName}
                                value={getAddressName} 
                                validationState="valid"
                                width={300}
                            />
                            :
                            <TextField
                                label="Nom d'adresse"
                                onChange={setAddressName}
                                value={getAddressName} 
                                validationState="invalid"
                                errorMessage="Veuillez entrer un nom correct (entre 5 et 50 caractères)."
                                width={300}
                            />
                        }
                    </div>
                    <div>                                               
                        {
                            (getFirstNameValidState === 1)
                            ?
                            <TextField
                                label="Prénom"
                                onChange={setFirstName}
                                value={getFirstName} 
                                validationState="valid"
                                width={300}
                            />
                            :
                            <TextField
                                label="Prénom"
                                onChange={setFirstName}
                                value={getFirstName}
                                validationState="invalid"
                                errorMessage="Veuillez entrer un nom correct (entre 3 et 50 caractères)."
                                width={300}
                            />
                        }
                    </div>
                    <div>
                        {
                            (getLastNameValidState === 1)
                            ?
                            <TextField
                                label="Nom"
                                onChange={setLastName}
                                value={getLastName}
                                validationState="valid"
                                width={300}
                            />
                            :
                            <TextField
                                label="Nom"
                                onChange={setLastName}
                                value={getLastName}
                                validationState="invalid"
                                errorMessage="Veuillez entrer un nom correct (entre 5 et 50 caractères)."
                                width={300}
                            />
                        }
                    </div>
                    <div>
                        {
                            (getAddressValidState === 1)
                            ?
                            <TextField
                                label="Adresse"
                                onChange={setAddress}
                                value={getAddress}
                                validationState="valid"
                                width={300}
                            />
                            :
                            <TextField
                                label="Adresse"
                                onChange={setAddress}
                                value={getAddress}
                                validationState="invalid"
                                errorMessage="Veuillez entrer une address valide."
                                width={300}
                            />
                        }
                    </div>
                    <div>
                        {
                            (getCityValidState === 1)
                            ?
                            <TextField
                                label="Ville"
                                onChange={setCity}
                                value={getCity}
                                validationState="valid"
                                width={300}
                            />
                            :
                            <TextField
                                label="Ville"
                                onChange={setCity}
                                value={getCity}
                                validationState="invalid"
                                errorMessage="Veuillez entrer un nom valide."
                                width={300}
                            />
                        }
                    </div>
                    <div>
                        {
                            (getZipCodeValidState === 1)
                            ?
                            <TextField
                                label="Code postal"
                                onChange={setZipCode}
                                value={getZipCode}
                                validationState="valid"
                                width={300}
                            />
                            :
                            <TextField
                                label="Code postal"
                                onChange={setZipCode}
                                value={getZipCode}
                                validationState="invalid"
                                errorMessage="Veuillez entrer un code postal valide."
                                width={300}
                            />
                        }
                    </div>
                    <div>
                        {
                            (getRegionValidState === 1)
                            ?
                            <TextField
                                label="Région"
                                onChange={setRegion}
                                value={getRegion}
                                validationState="valid"
                                width={300}
                            />
                            :
                            <TextField
                                label="Région"
                                onChange={setRegion}
                                value={getRegion}
                                validationState="invalid"
                                errorMessage="Veuillez entrer une region valide."
                                width={300}
                            />
                        }
                    </div>
                    <div>
                        {
                            (getCountryValidState === 1)
                            ?
                            <TextField
                                label="Pays"
                                onChange={setCountry}
                                value={getCountry}
                                validationState="valid"
                                width={300}
                            />
                            :
                            <TextField
                                label="Pays"
                                onChange={setCountry}
                                value={getCountry}
                                validationState="invalid"
                                errorMessage="Veuillez entrer un pays valide."
                                width={300}
                            />
                        }
                    </div>
                    <div>
                        {
                            (getPhoneValidState === 1)
                            ?
                            <TextField
                                label="Téléphone"
                                onChange={setPhone}
                                value={getPhone}
                                validationState="valid"
                                width={300}
                            />
                            :
                            <TextField
                                label="Téléphone"
                                onChange={setPhone}
                                value={getPhone}
                                validationState="invalid"
                                errorMessage="Veuillez entrer un numero valide."
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

export default MonCompteAdresse;