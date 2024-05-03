import React, { useEffect, useState, useContext } from 'react';
import { TextField, Checkbox } from "@adobe/react-spectrum";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from '../../context/UserProvider';
import { Data } from "../../services/api";
import { ToastQueue } from "@react-spectrum/toast";

const MonCompteEdit = () => {
    const [validState, setValidState] = useState(1);
    const { pullData } = useContext(UserContext);
    const [getUserName, setUserName] = useState([]);
    const [userData, setUserData] = useState(null); 
    const [isSelected, setSelected] = useState(false);

    let userId;

    useEffect(() => {
        let userData = pullData("user");
        setUserData(userData); 
        userId = userData.id;

        let data = {
            "table": "users",
            "id": userId
        };

        Data("panelAdmin", "getWhere", data).then(response => {
            if (response.success === true) {
                setUserName(response.data[0].full_name);
            } else {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
    }, []);

    useEffect(() => {
        if(getUserName.length < 2 || getUserName.length > 49) {
            setValidState(2);
        } else {
            setValidState(1);
        }
    }, [getUserName]);

    const navigate = useNavigate();

    const FormSubmitted = async (e) => {
        e.preventDefault();

        if (!isSelected) {
            ToastQueue.negative("Veuillez cocher la case pour confirmer la modification.", {timeout: 5000});
            return; 
        }

        if(validState === 1) {
            let data = {
                "table": "users",
                "id": userData ? userData.id : null,
                "data": {
                    "full_name": getUserName,
                }
            };
            
            Data("panelAdmin", "update", data).then(response => {
                if (response.success === true) {
                    ToastQueue.positive("Modification réussite avec succès !", {timeout: 5000});
                    navigate("/monCompte");
                } else {
                    ToastQueue.negative(response.error, {timeout: 5000});
                }
            });
        } else {
            ToastQueue.negative("Veuillez entrer un nom complet valide (entre 2 et 50 caractères).", {timeout: 5000});
        }
    };
        
    return(
        <>
            <div className="panelAdminAddElement">
                <form onSubmit={FormSubmitted}>
                    <h1 className="formTitle">Modifier le nom complet</h1>
                    <div>                                               
                    {
                        (validState === 1)
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
                            errorMessage="Veuillez entrer un nom correct (entre 2 et 50 caractères)."
                            width={300}
                        />
                    }
                    </div>
                    <div>
                        <Checkbox
                            isChecked={isSelected}
                            onChange={setSelected}
                        >
                            Voulez-vous modifier votre nom actuel ?
                        </Checkbox>
                    </div>
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
