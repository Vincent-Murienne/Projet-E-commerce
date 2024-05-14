import { useEffect,useState } from "react";
import { Data } from "../../../services/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastQueue } from "@react-spectrum/toast";
import { Checkbox, TextField } from "@adobe/react-spectrum";
import { sha512 } from 'js-sha512';


const UserEdit = () => {

    const [getUserName, setUserName] = useState(undefined);
    const [getUserNameValidState, setUserNameValidState] = useState(1);
    const [getEmail, setEmail] = useState(undefined);
    const [getEmailValidState, setEmailValidState] = useState(1);
    const [getPassword, setPassword] = useState(undefined);
    const [getPasswordValidState, setPasswordValidState] = useState(0);
    const [isAdmin, setIsAdmin] = useState(undefined);
    const [ChangePassword, setChangePassword] = useState(false);

    const { userId } = useParams(); // Retrieving the product ID from URL parameters
    let data = {
        "table": "users",
        "id": userId
    };

    useEffect(() => {
        Data("panelAdmin", "getWhere", data).then(response => {
            if (response.success === true)
            {
                setUserName(response.data[0].full_name);
                setEmail(response.data[0].email);
                setIsAdmin((response.data[0].role === 1 || response.data[0].role === "1") ? true : false);
            }
            else
            {
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
        if(getEmail !== undefined) {
            const emailRegex = /^[^\s@]{1,50}@[^\s@]+\.[^\s@]+$/;
            if(emailRegex.test(getEmail)) {
                setEmailValidState(1);
            } else {
                setEmailValidState(2);
            }
        }
    }, [getEmail]);

    useEffect(() => {
        if(getPassword !== undefined) {
            const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@#$%^&*()-_+=!]{12,30}$/;
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

        if(getUserNameValidState === 1 && getEmailValidState === 1) {

            let data = {
                "table": "users",
                "id": userId,
                "data": {
                    "full_name": getUserName,
                    "email": getEmail,
                    "role": (isAdmin) ? 1 : 0
                }
            };

            if(ChangePassword) {
                if(getPasswordValidState === 1) {
                    data = {
                        "table": "users",
                        "id": userId,
                        "data": {
                            "full_name": getUserName,
                            "email": getEmail,
                            "password": sha512(getPassword),
                            "role": (isAdmin) ? 1 : 0
                        }
                    };
                } else {
                    ToastQueue.negative("Veuillez remplir correctement tous les champs.", {timeout: 5000});
                    return;
                }
            }
    
            Data("panelAdmin", "update", data).then(response => {
                if (response.success === true)
                {
                    ToastQueue.positive("Modification réussite avec succès !", {timeout: 5000});
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
                    <h1 className="formTitle">Modifier un utilisateur</h1>
                    <div>
                        {
                            (getUserNameValidState === 1)
                            ?
                                <TextField
                                    label="Nom complet de l'utilisateur"
                                    onChange={setUserName}
                                    value={getUserName}
                                    isRequired 
                                    validationState="valid"
                                    width={300}
                                />
                            :
                                <TextField
                                    label="Nom complet de l'utilisateur"
                                    onChange={setUserName}
                                    value={getUserName}
                                    isRequired 
                                    validationState="invalid"
                                    errorMessage="Veuillez entrer un nom correct (entre 5 et 50 caractères)."
                                    width={300}
                                />
                        }
                    </div>
                    <div>
                        {
                            (getEmailValidState === 1)
                            ?
                                <TextField
                                    label="Email de l'utilisateur"
                                    onChange={setEmail}
                                    value={getEmail}
                                    isRequired 
                                    validationState="valid"
                                    width={300}
                                />
                            :
                                <TextField
                                    label="Email de l'utilisateur"
                                    onChange={setEmail}
                                    value={getEmail}
                                    isRequired 
                                    validationState="invalid"
                                    errorMessage="Veuillez entrer un email valide."
                                    width={300}
                                />
                        }
                    </div>
                    <div>
                        <Checkbox onChange={setChangePassword} width={300}>
                            Voulez-vous changer le mot de passe de cet utilisateur ?
                        </Checkbox>
                    </div>
                    {
                        (ChangePassword)
                        ?
                            <div>
                                {
                                    (getPasswordValidState === 0)
                                    ?
                                        <TextField
                                            label="Nouveau mot de passe de l'utilisateur"
                                            onChange={setPassword}
                                            isRequired
                                            type="password"
                                            width={300}
                                        />
                                    :
                                        (getPasswordValidState === 1)
                                        ?
                                            <TextField
                                                label="Nouveau mot de passe de l'utilisateur"
                                                onChange={setPassword}
                                                isRequired
                                                type="password"
                                                validationState="valid"
                                                width={300}
                                            />
                                        :
                                            <TextField
                                                label="Nouveau mot de passe de l'utilisateur"
                                                onChange={setPassword}
                                                isRequired
                                                type="password"
                                                validationState="invalid"
                                                errorMessage="Veuillez entrer un mot de passe valide (12 caractères minimum, 1 chiffre minimum)."
                                                width={300}
                                            />
                                }
                            </div>
                        :
                            <></>
                    }
                    <div>
                        <Checkbox onChange={setIsAdmin} width={300} isSelected={isAdmin}>
                            Voulez-vous faire de cet utilisateur un administrateur ?
                        </Checkbox>
                    </div>
                    <div className="buttons">
                        <Link to="/admin/UserManager" className="form-btn-error">Annuler</Link>
                        <button type="submit" className="form-btn-success" onClick={FormSubmitted}>Modifier</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default UserEdit;