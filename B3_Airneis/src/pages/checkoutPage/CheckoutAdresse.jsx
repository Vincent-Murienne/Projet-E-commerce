import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Data } from "../../services/api";
import { UserContext } from '../../context/UserProvider';
import { ToastQueue } from "@react-spectrum/toast";
import { Picker, Item } from '@react-spectrum/picker';
import { useTranslation } from 'react-i18next';
import { TextField } from "@adobe/react-spectrum";
import { fullNameRegex, firstNameRegex, addressRegex, zipCodeRegex, phoneRegex } from '../../utils/regexes';

const CheckoutAdresse = () => {
    const { t } = useTranslation();
    // Setting use states
    const { pullData } = useContext(UserContext);
    const [getUserAddresses, setUserAddresses] = useState([]);
    const [getSelectedAddress, setSelectedAddress] = useState("0"); 

    const [getAddressName, setAddressName] = useState("");
    const [getFirstName, setFirstName] = useState("");
    const [getLastName, setLastName] = useState("");
    const [getAddress, setAddress] = useState("");
    const [getCity, setCity] = useState("");
    const [getZipCode, setZipCode] = useState("");
    const [getRegion, setRegion] = useState("");
    const [getCountry, setCountry] = useState("");
    const [getPhone, setPhone] = useState("");

    const [getAddressNameValidState, setAddressNameValidState] = useState(1);
    const [getFirstNameValidState, setFirstNameValidState] = useState(1);
    const [getLastNameValidState, setLastNameValidState] = useState(1);
    const [getAddressValidState, setAddressValidState] = useState(1);
    const [getCityValidState, setCityValidState] = useState(1);
    const [getZipCodeValidState, setZipCodeValidState] = useState(1);
    const [getRegionValidState, setRegionValidState] = useState(1);
    const [getCountryValidState, setCountryValidState] = useState(1);
    const [getPhoneValidState, setPhoneValidState] = useState(1);

    // On change of the selected address, we change the address informations displayed
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
                setZipCode(formatZipCode(selectedAddress.zip_code));
                setRegion(selectedAddress.region);
                setCountry(selectedAddress.country);
                setPhone(selectedAddress.phone_number);
            }
        }
    }, [getSelectedAddress, getUserAddresses]);

    const [getUserId, setUserId] = useState(undefined);
    let userId;
    const navigate = useNavigate();

    // Make an API call to get all the user addresses. If his not connected, sends him back to the homepage with an error
    useEffect(() => {
        let userData = pullData("user"); // Get user information from the cookies        
        if(userData === undefined){
            ToastQueue.negative(t('formTitle'), {timeout: 5000});
            navigate("/");
            return;
        }
        setUserId(userData.id);

        userId = userData.id;

        const addressData = {
            "table": "addresses",
            "id": userId
        };

        Data("panelAdmin", "getUserAddresses", addressData).then(response => {
            if (response.success === true) {
                if(response.AddressDataEmpty === false) {
                    setUserAddresses(response.data); 
                    setSelectedAddress(response.data[0].id.toString());  
                    setAddressName(response.data[0].address_name);           
                    setFirstName(response.data[0].first_name);
                    setLastName(response.data[0].last_name);
                    setAddress(response.data[0].address);
                    setCity(response.data[0].city);
                    setZipCode(formatZipCode(response.data[0].zip_code)); 
                    setRegion(response.data[0].region);
                    setCountry(response.data[0].country);
                    setPhone(response.data[0].phone_number);
                    setUserId(userId);
                } else {
                    setSelectedAddress("0");
                }
            } else {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
    }, []);

    const formatZipCode = (zipCode) => {
        zipCode = "00000" + zipCode;

        return zipCode[zipCode.length-5] + zipCode[zipCode.length-4] + zipCode[zipCode.length-3] + zipCode[zipCode.length-2] + zipCode[zipCode.length-1];
    }

    // Check the validation of the inputs
    useEffect(() => {
        if(getAddressName !== undefined && getAddressName !== "") {
            if(fullNameRegex.test(getAddressName)) {
                setAddressNameValidState(1);
            } else {
                setAddressNameValidState(2);
            }
        }
    }, [getAddressName]);

    useEffect(() => {
        if(getFirstName !== undefined && getFirstName !== "") {
            if(firstNameRegex.test(getFirstName)) {
                setFirstNameValidState(1);
            } else {
                setFirstNameValidState(2);
            }
        }
    }, [getFirstName]);

    useEffect(() => {
        if(getLastName !== undefined && getLastName !== "") {
            if(firstNameRegex.test(getLastName)) {
                setLastNameValidState(1);
            } else {
                setLastNameValidState(2);
            }
        }
    }, [getLastName]);

    useEffect(() => {
        if(getAddress !== undefined && getAddress !== "") {
            if(addressRegex.test(getAddress)) {
                setAddressValidState(1); 
            } else {
                setAddressValidState(2); 
            }
        }
    }, [getAddress]);

    useEffect(() => {
        if(getCity !== undefined && getCity !== "") {
            if(firstNameRegex.test(getCity)) {
                setCityValidState(1); 
            } else {
                setCityValidState(2); 
            }
        }
    }, [getCity]);
    
    useEffect(() => {
        if(getZipCode !== undefined && getZipCode !== "") {
            if(zipCodeRegex.test(getZipCode)) {
                setZipCodeValidState(1); 
            } else {
                setZipCodeValidState(2); 
            }
        }
    }, [getZipCode]);

    useEffect(() => {
        if(getRegion !== undefined && getRegion !== "") {
            if(firstNameRegex.test(getRegion)) {
                setRegionValidState(1); 
            } else {
                setRegionValidState(2); 
            }
        }
    }, [getRegion]);
    
    useEffect(() => {
        if(getCountry !== undefined && getCountry !== "") {
            if(firstNameRegex.test(getCountry)) {
                setCountryValidState(1); 
            } else {
                setCountryValidState(2); 
            }
        }
    }, [getCountry]);
    
    useEffect(() => {
        if(getPhone !== undefined && getPhone !== "") {
            if(phoneRegex.test(getPhone)) {
                setPhoneValidState(1); 
            } else {
                setPhoneValidState(2);
            }
        }
    }, [getPhone]);

    // Check if all the inputs of the form are valid
    const isFormValid = () => {
        return (
            getAddressNameValidState === 1 &&
            getFirstNameValidState === 1 &&
            getLastNameValidState === 1 &&
            getAddressValidState === 1 &&
            getCityValidState === 1 &&
            getZipCodeValidState === 1 &&
            getRegionValidState === 1 &&
            getCountryValidState === 1 &&
            getPhoneValidState === 1
        );
    };
    
    // Form submission
    const FormSubmitted = async (e) => {
        e.preventDefault();
        if (!isFormValid()) {
            ToastQueue.negative(t('fillAllFieldsCorrectly'), { timeout: 5000 });
            return;
        }

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

        Data("panelAdmin", "insertAddress", data).then(response => {
            if (response.success === true) {
                navigate(`/checkoutPayment?addressId=${response.id}`);
            } else {
                ToastQueue.negative(response.error, { timeout: 5000 });
            }
        });
    } 

    // Render different buttons depending of which address is currently selected
    const renderButtons = () => {
        if (getSelectedAddress === "0") {
            return (
                <>
                    <Link to="/panier" className="form-btn-error">{t('backButton')}</Link> 
                    <button type="submit" className="form-btn-success">{t('validateButton')}</button>
                </>
            );
        } else {
            return (
                <>
                    <Link to="/panier" className="form-btn-error">{t('backButton')}</Link> 
                    <Link to={`/checkoutPayment?addressId=${getSelectedAddress}`} className="form-btn-success">{t('validateButton')}</Link>
                </>
            );
        }
    };
    
    return (   
        <>
            <div className="panelAdminAddElement">
                <form onSubmit={FormSubmitted}>
                    <h2 className="formTitle">{t('formTitle')}</h2>
    
                    <div className="picker-container">
                        <Picker
                            label={t('chooseAddressLabel')}
                            necessityIndicator="label"
                            isRequired
                            minWidth={300}
                            items={[{ id: 0, address_name: t('addNewAddress') }, ...getUserAddresses]}
                            selectedKey={getSelectedAddress} 
                            onSelectionChange={selected => setSelectedAddress(selected)}
                        >
                            {item => <Item key={item.id}>{item.address_name}</Item>}
                        </Picker>
                    </div> 
    
                    <div>                                               
                        <TextField
                            label={t('addressName')}
                            onChange={setAddressName}
                            value={getAddressName}
                            isReadOnly={getSelectedAddress !== "0"}
                            validationState={getAddressNameValidState === 1 ? "valid" : "invalid"}
                            errorMessage={t('addressNameValidError')}
                            width={300}
                        />
                    </div>
    
                    <div>                                               
                        <TextField
                            label={t('firstName')}
                            onChange={setFirstName}
                            value={getFirstName}
                            isReadOnly={getSelectedAddress !== "0"}
                            validationState={getFirstNameValidState === 1 ? "valid" : "invalid"}
                            errorMessage={t('firstNameValidError')}
                            width={300}
                        />
                    </div>
    
                    <div>
                        <TextField
                            label={t('lastName')}
                            onChange={setLastName}
                            value={getLastName}
                            isReadOnly={getSelectedAddress !== "0"}
                            validationState={getLastNameValidState === 1 ? "valid" : "invalid"}
                            errorMessage={t('lastNameValidError')}
                            width={300}
                        />
                    </div>
    
                    <div>
                        <TextField
                            label={t('address')}
                            onChange={setAddress}
                            value={getAddress}
                            isReadOnly={getSelectedAddress !== "0"}
                            validationState={getAddressValidState === 1 ? "valid" : "invalid"}
                            errorMessage={t('addressValidError')}
                            width={300}
                        />
                    </div>
    
                    <div>
                        <TextField
                            label={t('city')}
                            onChange={setCity}
                            value={getCity}
                            isReadOnly={getSelectedAddress !== "0"}
                            validationState={getCityValidState === 1 ? "valid" : "invalid"}
                            errorMessage={t('cityValidError')}
                            width={300}
                        />
                    </div>
    
                    <div>
                        <TextField
                            label={t('zipCode')}
                            onChange={setZipCode}
                            value={getZipCode}
                            isReadOnly={getSelectedAddress !== "0"}
                            validationState={getZipCodeValidState === 1 ? "valid" : "invalid"}
                            errorMessage={t('zipCodeValidError')}
                            width={300}
                        />
                    </div>
    
                    <div>
                        <TextField
                            label={t('region')}
                            onChange={setRegion}
                            value={getRegion}
                            isReadOnly={getSelectedAddress !== "0"}
                            validationState={getRegionValidState === 1 ? "valid" : "invalid"}
                            errorMessage={t('regionValidError')}
                            width={300}
                        />
                    </div>
    
                    <div>
                        <TextField
                            label={t('country')}
                            onChange={setCountry}
                            value={getCountry}
                            isReadOnly={getSelectedAddress !== "0"}
                            validationState={getCountryValidState === 1 ? "valid" : "invalid"}
                            errorMessage={t('countryValidError')}
                            width={300}
                        />
                    </div>
    
                    <div>
                        <TextField
                            label={t('phoneNumber')}
                            onChange={setPhone}
                            value={getPhone}
                            isReadOnly={getSelectedAddress !== "0"}
                            validationState={getPhoneValidState === 1 ? "valid" : "invalid"}
                            errorMessage={t('phoneValidError')}
                            width={300}
                        />
                    </div>
    
                    <div className="buttons">
                        {renderButtons()}
                    </div> 
                </form>                            
            </div>
        </>
    );
    
};

export default CheckoutAdresse;
