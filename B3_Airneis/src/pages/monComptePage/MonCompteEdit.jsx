import { useEffect, useState, useContext } from 'react';
import { TextField, Checkbox } from "@adobe/react-spectrum";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from '../../context/UserProvider';
import { Data } from "../../services/api";
import { ToastQueue } from "@react-spectrum/toast";
import { sha512 } from 'js-sha512';
import { fullNameRegex, emailRegex, passwordRegex } from '../../utils/regexes';
import { useTranslation } from 'react-i18next'; // Import pour les traductions

const MonCompteEdit = () => {
    const { t } = useTranslation(); // Hook pour les traductions

    // Setting use states
    const { pullData } = useContext(UserContext);
    const [getUserNameValidState, setUserNameValidState] = useState(1);
    const [getUserMailValidState, setUserMailValidState] = useState(1);
    const [getPasswordValidState, setPasswordValidState] = useState(0);

    const [getOldPassword, setOldPassword] = useState(undefined); 
    const [getNewPassword, setNewPassword] = useState(undefined);
    const [getChangePassword, setChangePassword] = useState(false);
    const [getUserPassword, setUserPassword] = useState(undefined);

    const [getUserName, setUserName] = useState(undefined);  
    const [getUserMail, setUserMail] = useState(undefined);

    const [getUserId, setUserId] = useState(undefined);
    let userId;
    const navigate = useNavigate();

    // Make an API call to get all the user information. If not connected, send them back to the homepage with an error
    useEffect(() => {
        let userData = pullData("user"); // Get user information from the cookies       
        if(userData === undefined){
            ToastQueue.negative(t("pleaseLogin"), {timeout: 5000}); // Message traduit
            navigate("/");
            return;
        }

        userId = userData.id;

        let data = {
            "table": "users",
            "id": userId
        };

        Data("panelAdmin", "getUserInfo", data).then(response => {
            if (response.success === true) {
                setUserName(response.data.full_name);
                setUserMail(response.data.email);
                setUserPassword(response.data.password);
                setUserId(userId);

            } else {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
    }, []);

    // Check the validation of the inputs
    useEffect(() => {
        if(getUserName !== undefined) {
            if(fullNameRegex.test(getUserName)) {
                setUserNameValidState(1);
            } else {
                setUserNameValidState(2);
            }
        }
    }, [getUserName]);

    useEffect(() => {
        if(getUserMail !== undefined) {
            if(emailRegex.test(getUserMail)) {
                setUserMailValidState(1);
            } else {
                setUserMailValidState(2);
            }
        }
    }, [getUserMail]);

    useEffect(() => {
        if(getNewPassword !== undefined){
            if(passwordRegex.test(getNewPassword)) {
                setPasswordValidState(1);
            } else {
                setPasswordValidState(2);
            }
        } 
    }, [getNewPassword]);

    // Form submission
    const FormSubmitted = async (e) => {
        e.preventDefault();

        if(getUserNameValidState === 1 && getUserMailValidState === 1) {
            let data = {
                "table": "users",
                "id": getUserId,
                "data": {
                    "full_name": getUserName,
                    "email": getUserMail,
                }
            };

            if(getChangePassword) {
                // Check if the old password matches the current password
                if (sha512(getOldPassword) !== getUserPassword) {
                    ToastQueue.negative(t("oldPasswordIncorrect"), {timeout: 5000}); // Message traduit
                    return;
                }

                if(getPasswordValidState === 1) {
                    // Update with the new password
                    data = {
                        "table": "users",
                        "id": getUserId,
                        "data": {
                            "full_name": getUserName,
                            "email": getUserMail,
                            "password": sha512(getNewPassword), // Use the new password
                        }
                    };
                } else {
                    ToastQueue.negative(t("fillAllFieldsCorrectly"), {timeout: 5000}); // Message traduit
                    return;
                }
            }
            Data("panelAdmin", "updateUser", data).then(response => {
                if (response.success === true) {
                    ToastQueue.positive(t("updateSuccess"), {timeout: 5000}); // Message traduit
                    navigate("/monCompteParametres");
                } else {
                    ToastQueue.negative(response.error, {timeout: 5000});
                }
            });
        } else {
            ToastQueue.negative(t("fillAllFieldsCorrectly"), {timeout: 5000}); // Message traduit
        }
    };

    return(
        <>
            <div className="monComptePageAdresse">
                <form onSubmit={FormSubmitted}>
                    <h1 className="formTitle">{t("editProfileTitle")}</h1> {/* Titre traduit */}
                    <div>                                               
                        {
                            (getUserNameValidState === 1)
                            ?
                            <TextField
                                label={t("fullName")} // Label traduit
                                onChange={setUserName}
                                value={getUserName} 
                                validationState="valid"
                                width={300}
                            />
                            :
                            <TextField
                                label={t("fullName")} // Label traduit
                                onChange={setUserName}
                                value={getUserName}
                                validationState="invalid"
                                errorMessage={t("nameErrorMessage")} // Message d'erreur traduit
                                width={300}
                            />
                        }
                    </div>
                    <div>
                        {
                            (getUserMailValidState === 1)
                            ?
                            <TextField
                                label={t("email")}
                                onChange={setUserMail}
                                value={getUserMail}
                                isRequired 
                                validationState="valid"
                                width={300}
                            />
                            :
                            <TextField
                                label={t("email")}
                                onChange={setUserMail}
                                value={getUserMail}
                                isRequired 
                                validationState="invalid"
                                errorMessage={t("emailErrorMessage")} // Message d'erreur traduit
                                width={300}
                            />
                        }
                    </div>
                    <div>
                        <Checkbox onChange={setChangePassword} width={300}>
                            {t("changePassword")} {/* Label Checkbox traduit */}
                        </Checkbox>
                    </div>
                    {
                        (getChangePassword)
                        ?
                        <div>
                            <TextField
                                label={t("oldPassword")} // Label traduit
                                onChange={setOldPassword} 
                                isRequired
                                type="password"
                                width={300}
                            />
                            {
                                (getPasswordValidState === 0)
                                ?
                                <TextField
                                    label={t("newPassword")} // Label traduit
                                    onChange={setNewPassword} 
                                    isRequired
                                    type="password"
                                    width={300}
                                />
                                :
                                (getPasswordValidState === 1)
                                ?
                                <TextField
                                    label={t("newPassword")} // Label traduit
                                    onChange={setNewPassword} 
                                    isRequired
                                    type="password"
                                    validationState="valid"
                                    width={300}
                                />
                                :
                                <TextField
                                    label={t("newPassword")} // Label traduit
                                    onChange={setNewPassword} 
                                    isRequired
                                    type="password"
                                    validationState="invalid"
                                    errorMessage={t("passwordErrorMessage")} // Message d'erreur traduit
                                    width={300}
                                />
                            }
                        </div>
                        :
                        <> </>
                    }
                    <div className="buttons">
                        <Link to="/monCompteParametres" className="form-btn-error">{t("cancel")}</Link> {/* Bouton traduit */}
                        <button type="submit" className="form-btn-success" onClick={FormSubmitted}>{t("submitEdit")}</button> {/* Bouton traduit */}
                    </div>                 
                </form>                   
            </div>
        </>
    );
};

export default MonCompteEdit;
