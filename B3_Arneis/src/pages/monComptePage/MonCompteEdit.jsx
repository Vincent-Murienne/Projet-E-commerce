import React, { useEffect, useState, useContext } from 'react';
import { TextField, Checkbox } from "@adobe/react-spectrum";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from '../../context/UserProvider';
import { Data } from "../../services/api";
import { ToastQueue } from "@react-spectrum/toast";
import { sha512 } from 'js-sha512';

const MonCompteEdit = () => {
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

    useEffect(() => {
        let userData = pullData("user");       
        if(userData === undefined){
            ToastQueue.negative("Veuillez vous connecter afin de pouvoir accéder à cette page.", {timeout: 5000});
            navigate("/");
            return;
        }

        userId = userData.id;

        let data = {
            "table": "users",
            "id": userId
        };

        Data("panelAdmin", "getWhere", data).then(response => {
            if (response.success === true) {
                setUserName(response.data[0].full_name);
                setUserMail(response.data[0].email);
                setUserPassword(response.data[0].password);
                setUserId(userId);

            } else {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
    }, []);

    useEffect(() => {
        if(getUserName !== undefined) {
            const fullNameRegex = /^[a-zA-ZÀ-ÿ\s-]{5,50}$/;
            if(fullNameRegex.test(getUserName)) {
                setUserNameValidState(1);
            } else {
                setUserNameValidState(2);
            }
        }
    }, [getUserName]);

    useEffect(() => {
        if(getUserMail !== undefined) {
            const emailRegex = /^[^\s@]{1,50}@[^\s@]+\.[^\s@]+$/;
            if(emailRegex.test(getUserMail)) {
                setUserMailValidState(1);
            } else {
                setUserMailValidState(2);
            }
        }
    }, [getUserMail]);

    useEffect(() => {
        if(getNewPassword !== undefined){
            const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@#$%^&*()-_+=!]{12,30}$/;
            if(passwordRegex.test(getNewPassword)) {
                setPasswordValidState(1);
            } else {
                setPasswordValidState(2);
            }
        } 
    }, [getNewPassword]);

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
                    ToastQueue.negative("L'ancien mot de passe est incorrect.", {timeout: 5000});
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
                    ToastQueue.negative("Veuillez remplir correctement tous les champs.", {timeout: 5000});
                    return;
                }
            }
            Data("panelAdmin", "update", data).then(response => {
                if (response.success === true) {
                    ToastQueue.positive("Modification réussie avec succès !", {timeout: 5000});
                    navigate("/monCompte");
                } else {
                    ToastQueue.negative(response.error, {timeout: 5000});
                }
            });
        } else {
            ToastQueue.negative("Veuillez remplir correctement tous les champs.", {timeout: 5000});
        }
    };

    return(
        <>
            <div className="panelAdminAddElement">
                <form onSubmit={FormSubmitted}>
                    <h1 className="formTitle">Modifier le profil</h1>
                    <div>                                               
                        {
                            (getUserNameValidState === 1)
                            ?
                            <TextField
                                label="Nom complet"
                                onChange={setUserName}
                                value={getUserName} 
                                validationState="valid"
                                width={300}
                            />
                            :
                            <TextField
                                label="Nom complet"
                                onChange={setUserName}
                                value={getUserName}
                                validationState="invalid"
                                errorMessage="Veuillez entrer un nom correct (entre 5 et 50 caractères)."
                                width={300}
                            />
                        }
                    </div>
                    <div>
                        {
                            (getUserMailValidState === 1)
                            ?
                            <TextField
                                label="Email"
                                onChange={setUserMail}
                                value={getUserMail}
                                isRequired 
                                validationState="valid"
                                width={300}
                            />
                            :
                            <TextField
                                label="Email"
                                onChange={setUserMail}
                                value={getUserMail}
                                isRequired 
                                validationState="invalid"
                                errorMessage="Veuillez entrer un email valide."
                                width={300}
                            />
                        }
                    </div>
                    <div>
                        <Checkbox onChange={setChangePassword} width={300}>
                            Voulez-vous changer de mot de passe ?
                        </Checkbox>
                    </div>
                    {
                        (getChangePassword)
                        ?
                        <div>
                            <TextField
                                label="Ancien mot de passe"
                                onChange={setOldPassword} 
                                isRequired
                                type="password"
                                width={300}
                            />
                            {
                                (getPasswordValidState === 0)
                                ?
                                <TextField
                                    label="Nouveau mot de passe"
                                    onChange={setNewPassword} 
                                    isRequired
                                    type="password"
                                    width={300}
                                />
                                :
                                (getPasswordValidState === 1)
                                ?
                                <TextField
                                    label="Nouveau mot de passe"
                                    onChange={setNewPassword} 
                                    isRequired
                                    type="password"
                                    validationState="valid"
                                    width={300}
                                />
                                :
                                <TextField
                                    label="Nouveau mot de passe"
                                    onChange={setNewPassword} 
                                    isRequired
                                    type="password"
                                    validationState="invalid"
                                    errorMessage="Veuillez entrer un mot de passe valide (12 caractères minimum, 1 chiffre minimum)."
                                    width={300}
                                />
                            }
                        </div>
                        :
                        <> </>
                    }
                    <div className="buttons">
                        <Link to="/monCompte" className="form-btn-error">Annuler</Link>
                        <button type="submit" className="form-btn-success" onClick={FormSubmitted}>Modifier</button>
                    </div>                 
                </form>                   
            </div>
        </>
    );
};

export default MonCompteEdit;
