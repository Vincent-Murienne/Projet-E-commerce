import { useContext, useEffect, useState } from 'react';
import { TextField } from "@adobe/react-spectrum";
import { Link, useNavigate } from 'react-router-dom';
import { Data } from "../../services/api";
import { UserContext } from '../../context/UserProvider';
import { ToastQueue } from "@react-spectrum/toast";
import { mkConfig, generateCsv, download } from "export-to-csv";

const MonCompteParametres = () => {
    // Setting use states
    const { pullData, handleLogout } = useContext(UserContext);
    const [getUserName, setUserName] = useState([]);
    const [getUserMail, setUserMail] = useState([]);

    const [getUserId, setUserId] = useState(undefined);
    let userId;
    const navigate = useNavigate();

    // Make an API call to get all the user information. If his not connected, sends him back to the homepage with an error
    useEffect(() => {
        let userData = pullData("user"); // Get user information from the cookies   
        if(userData === undefined){
            ToastQueue.negative("Veuillez vous connecter afin de pouvoir accéder à cette page.", {timeout: 5000});
            navigate("/");
            return;
        }

        userId = userData.id;
        setUserId(userId);

        let data = {
            "table": "users",
            "id": userId
        };

        Data("panelAdmin", "getUserInfo", data).then(response => {
            if (response.success === true) {
                setUserName(response.data.full_name);
                setUserMail(response.data.email);
            } else {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
    }, []);

    // Make an API call to get all personnal informations relative to this user and force the download of the file on his browser
    const handleDownloadData = () => {
        const csvConfig = mkConfig({ useKeysAsHeaders: true });

        Data("monCompte", "downloadPersonalData", {"id": getUserId}).then(response => {
            if (response.success) {
                const csv = generateCsv(csvConfig)(response.data);
                download(csvConfig)(csv);
                ToastQueue.positive("Téléchargement de vos données personnelles réussit.", {timeout: 5000});
            } else {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
    };

    // Make an API call to delete the user account. By precaution, there is a confirm window that will pop to prevent missclicks
    const handleDeleteAccount = () => {
        const confirmed = window.confirm("Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.");
        if (confirmed) {
            const data = {
                "table": "users",
                "id": getUserId,
            };
            Data("panelAdmin", "deleteUser", data).then(response => {
                if (response.success) {
                    ToastQueue.positive("Compte supprimé avec succès.", {timeout: 5000});
                    handleLogout();
                    navigate("/");      
                    window.location.reload();               
                } else {
                    ToastQueue.negative(response.error, {timeout: 5000});
                }
            });
        }
    };

    return (   
        <>
            <section className="comptePage"> 
                <h1 className="titreCompte">Paramètres de mon compte</h1>
                
                <div className="input-group">
                    <div className="input-container">
                        <TextField
                            label="Nom complet"
                            value={getUserName}
                            width={300}
                            disabled // To prevent editing the field
                        />
                    </div>
                </div>

                <div className="input-group">
                    <div className="input-container">
                        <TextField
                            label="E-mail"
                            value={getUserMail}
                            width={300}
                            disabled
                        />                     
                    </div>
                </div>

                <div className="input-group">
                    <div className="input-container">
                        <TextField
                            label="Mot de passe"
                            value="zgecsudbzgeviuzebfjzhegoifzuebf"
                            type="password"
                            width={300}
                            disabled
                        />                 
                    </div>
                </div>
                
                <div className="input-group">
                    <h4 className="addresses-title">Mes adresses</h4>
                    <div className="bordered-button">
                        <Link to="/MonCompteAddresse" className="custom-link">
                            <button type="button" className="custom-button">
                                Voir mes adresses
                            </button>
                        </Link>
                    </div>
                </div>
        
                <div className="buttons-container">
                    <button className="submit" type="submit" onClick={handleDownloadData}>Télécharger mes données</button>
                    <Link to="/monCompteEdit" className="submitModify">Modifier mes données</Link>
                    <button className="submitDelete" type="submit" onClick={handleDeleteAccount}>Supprimer mon compte</button>
                </div>
            </section>
        </>
    );
}

export default MonCompteParametres;
