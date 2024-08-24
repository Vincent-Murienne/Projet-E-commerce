import { useContext, useEffect, useState } from 'react';
import { TextField } from "@adobe/react-spectrum";
import { Link, useNavigate } from 'react-router-dom';
import { Data } from "../../services/api";
import { UserContext } from '../../context/UserProvider';
import { ToastQueue } from "@react-spectrum/toast";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { useTranslation } from 'react-i18next'; 

const MonCompteParametres = () => {
    const { t } = useTranslation(); 
    const { pullData, handleLogout } = useContext(UserContext);
    const [getUserName, setUserName] = useState([]);
    const [getUserMail, setUserMail] = useState([]);
    const [getUserId, setUserId] = useState(undefined);
    let userId;
    const navigate = useNavigate();

    useEffect(() => {
        let userData = pullData("user");
        if (userData === undefined) {
            ToastQueue.negative(t('pleaseLogin'), { timeout: 5000 }); 
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
                ToastQueue.negative(response.error, { timeout: 5000 });
            }
        });
    }, []);

    const handleDownloadData = () => {
        const csvConfig = mkConfig({ useKeysAsHeaders: true });

        Data("monCompte", "downloadPersonalData", { "id": getUserId }).then(response => {
            if (response.success) {
                const csv = generateCsv(csvConfig)(response.data);
                download(csvConfig)(csv);
                ToastQueue.positive(t('downloadSuccess'), { timeout: 5000 }); 
            } else {
                ToastQueue.negative(response.error, { timeout: 5000 });
            }
        });
    };

    const handleDeleteAccount = () => {
        const confirmed = window.confirm(t('deleteAccountConfirmation')); 
        if (confirmed) {
            const data = {
                "table": "users",
                "id": getUserId,
            };
            Data("panelAdmin", "deleteUser", data).then(response => {
                if (response.success) {
                    ToastQueue.positive(t('accountDeleted'), { timeout: 5000 }); 
                    handleLogout();
                    navigate("/");
                    window.location.reload();
                } else {
                    ToastQueue.negative(response.error, { timeout: 5000 });
                }
            });
        }
    };

    return (
        <>
            <section className="comptePage">
                <h1 className="titreCompte">{t('accountSettingsTitle')}</h1>
                <div className="input-group">
                    <div className="input-container">
                        <TextField
                            label={t('fullName')} 
                            value={getUserName}
                            width={300}
                            disabled
                        />
                    </div>
                </div>

                <div className="input-group">
                    <div className="input-container">
                        <TextField
                            label={t('email')} 
                            value={getUserMail}
                            width={300}
                            disabled
                        />
                    </div>
                </div>

                <div className="input-group">
                    <div className="input-container">
                        <TextField
                            label={t('password')} 
                            value="zgecsudbzgeviuzebfjzhegoifzuebf"
                            type="password"
                            width={300}
                            disabled
                        />
                    </div>
                </div>

                <div className="input-group">
                    <h4 className="addresses-title">{t('myAddresses')}</h4> 
                    <div className="bordered-button">
                        <Link to="/MonCompteAddresse" className="custom-link">
                            <button type="button" className="custom-button">
                                {t('viewAddresses')} 
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="buttons-container">
                    <button className="submit" type="submit" onClick={handleDownloadData}>
                        {t('downloadData')} 
                    </button>
                    <Link to="/monCompteEdit" className="submitModify">
                        {t('editData')} 
                    </Link>
                    <button className="submitDelete" type="submit" onClick={handleDeleteAccount}>
                        {t('deleteAccount')} 
                    </button>
                </div>
            </section>
        </>
    );
}

export default MonCompteParametres;
