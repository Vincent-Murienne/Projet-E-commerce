import { useEffect, useState } from "react";
import { Data } from "../../../services/api";
import { Checkbox, TextField } from "@adobe/react-spectrum";
import { Link, useNavigate } from "react-router-dom";
import { ToastQueue } from "@react-spectrum/toast";
import { fullNameRegex, emailRegex, passwordRegex } from '../../../utils/regexes';


const UserAdd = () => {

    // Setting use states
    const [getUserName, setUserName] = useState(null);
    const [getUserNameValidState, setUserNameValidState] = useState(0);
    const [getEmail, setEmail] = useState(null);
    const [getEmailValidState, setEmailValidState] = useState(0);
    const [getPassword, setPassword] = useState(null);
    const [getPasswordValidState, setPasswordValidState] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);

    // Check the validation of the inputs
    useEffect(() => {
        if(getUserName !== null) {
            if(fullNameRegex.test(getUserName)) {
                setUserNameValidState(1);
            } else {
                setUserNameValidState(2);
            }
        }
    }, [getUserName]);

    useEffect(() => {
        if(getEmail !== null) {
            if(emailRegex.test(getEmail)) {
                setEmailValidState(1);
            } else {
                setEmailValidState(2);
            }
        }
    }, [getEmail]);

    useEffect(() => {
        if(getPassword !== null) {
            if(passwordRegex.test(getPassword)) {
                setPasswordValidState(1);
            } else {
                setPasswordValidState(2);
            }
        }
    }, [getPassword]);

    //We are now going to handle the form submission
    const navigate = useNavigate();

    const FormSubmitted = async (e) => {
        e.preventDefault();
    
        if(getUserNameValidState === 1 && getEmailValidState === 1 && getPasswordValidState === 1) {
            // We are going to add the user to the database
            let data = {
                "table": "users",
                "data": {
                    "full_name": getUserName,
                    "email": getEmail,
                    "password": getPassword,
                    "role": (isAdmin) ? 1 : 0
                }
            };

            Data("panelAdmin", "insertUser", data).then(response => {
                if (response.success === true)
                {
                    ToastQueue.positive("Création réussite avec succès !", {timeout: 5000});
                    navigate("/admin/UserManager");
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

    return(
        <>
            <div className="panelAdminAddElement">
                <form onSubmit={FormSubmitted}>
                    <h1 className="formTitle">Ajouter un utilisateur</h1>
                    <div>
                        {
                            (getUserNameValidState === 0)
                            ?
                                <TextField
                                    label="Nom complet de l'utilisateur"
                                    onChange={setUserName}
                                    isRequired
                                    width={300}
                                />
                            :
                                (getUserNameValidState === 1)
                                ?
                                    <TextField
                                        label="Nom complet de l'utilisateur"
                                        onChange={setUserName}
                                        isRequired 
                                        validationState="valid"
                                        width={300}
                                    />
                                :
                                    <TextField
                                        label="Nom complet de l'utilisateur"
                                        onChange={setUserName}
                                        isRequired 
                                        validationState="invalid"
                                        errorMessage="Veuillez entrer un nom correct (entre 5 et 50 caractères)."
                                        width={300}
                                    />
                        }
                    </div>
                    <div>
                        {
                            (getEmailValidState === 0)
                            ?
                                <TextField
                                    label="Email de l'utilisateur"
                                    onChange={setEmail}
                                    isRequired
                                    width={300}
                                />
                            :
                                (getEmailValidState === 1)
                                ?
                                    <TextField
                                        label="Email de l'utilisateur"
                                        onChange={setEmail}
                                        isRequired 
                                        validationState="valid"
                                        width={300}
                                    />
                                :
                                    <TextField
                                        label="Email de l'utilisateur"
                                        onChange={setEmail}
                                        isRequired 
                                        validationState="invalid"
                                        errorMessage="Veuillez entrer un email valide."
                                        width={300}
                                    />
                        }
                    </div>
                    <div>
                        {
                            (getPasswordValidState === 0)
                            ?
                                <TextField
                                    label="Mot de passe de l'utilisateur"
                                    onChange={setPassword}
                                    isRequired
                                    type="password"
                                    width={300}
                                />
                            :
                                (getPasswordValidState === 1)
                                ?
                                    <TextField
                                        label="Mot de passe de l'utilisateur"
                                        onChange={setPassword}
                                        isRequired 
                                        type="password"
                                        validationState="valid"
                                        width={300}
                                    />
                                :
                                    <TextField
                                        label="Mot de passe de l'utilisateur"
                                        onChange={setPassword}
                                        isRequired 
                                        type="password"
                                        validationState="invalid"
                                        errorMessage="Veuillez entrer un mot de passe valide (12 caractères minimum, 1 chiffre minimum)."
                                        width={300}
                                    />
                        }
                    </div>
                    <div>
                        <Checkbox onChange={setIsAdmin} width={300}>
                            Voulez-vous faire de cet utilisateur un administrateur ?
                        </Checkbox>
                    </div>
                    <div className="buttons">
                        <Link to="/admin/UserManager" className="form-btn-error">Annuler</Link>
                        <button type="submit" className="form-btn-success" onClick={FormSubmitted}>Ajouter</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default UserAdd;