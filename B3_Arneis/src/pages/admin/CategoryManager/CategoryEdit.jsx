import { useEffect,useState } from "react";
import { Data } from "../../../services/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastQueue } from "@react-spectrum/toast";
import { TextField } from "@adobe/react-spectrum";


const CategoryEdit = () => {

    const [getCategoryDetails, setCategoryDetails] = useState([]);
    const [getCategoryName, setCategoryName] = useState([]);
    const [validState, setValidState] = useState(0);

    const { categoryId } = useParams(); // Retrieving the category ID from URL parameters
    let data = {
        "table": "categories",
        "id": categoryId
    };

    useEffect(() => {
        Data("panelAdmin", "getWhere", data).then(response => {
            if (response.success === true)
            {
                setCategoryDetails(response.data[0]);
                setCategoryName(response.data[0].name)
            }
            else
            {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
    }, []);

    useEffect(() => {
        if(getCategoryName !== null) {
            if(getCategoryName.length < 2 || getCategoryName.length > 49) {
                setValidState(2);
                setCategoryName(null);
            } else {
                setValidState(1);
            }
        }
    }, [getCategoryName]);

    //We are now going to handle the form submission
    const navigate = useNavigate();

    const FormSubmitted = async (e) => {
        e.preventDefault();

        if(getCategoryName !== null) {
            console.log(getCategoryName);
            let data = {
                "table": "categories",
                "id": categoryId,
                "data": {
                    "name": getCategoryName
                }
            };
    
            Data("panelAdmin", "update", data).then(response => {
                if (response.success === true)
                {
                    ToastQueue.positive("Modification réussite avec succès !", {timeout: 5000});
                    navigate("/admin/CategoryManager");
                }
                else
                {
                    ToastQueue.negative(response.error, {timeout: 5000});
                }
            });
        } else {
            ToastQueue.negative("Veuillez entrer un nom de catégorie valide (entre 2 et 50 caractères", {timeout: 5000});
        }
    };

    return(
        <>
            <div className="panelAdminAddElement">
                <form onSubmit={FormSubmitted}>
                    <h1 className="formTitle">Modifier une catégorie</h1>
                    <div>
                        {
                            (validState === 0)
                            ?
                                <TextField
                                    label="Nom de la catégorie"
                                    onChange={setCategoryName}
                                    value={getCategoryName}
                                    isRequired
                                    width={300}
                                />
                            :
                                (validState === 1)
                                ?
                                    <TextField
                                        label="Nom de la catégorie"
                                        onChange={setCategoryName}
                                        value={getCategoryName}
                                        isRequired 
                                        validationState="valid"
                                        errorMessage="Veuillez entrer un nom correct (entre 2 et 50 caractères)."
                                        width={300}
                                    />
                                :
                                    <TextField
                                        label="Nom de la catégorie"
                                        onChange={setCategoryName}
                                        value={getCategoryName}
                                        isRequired 
                                        validationState="invalid"
                                        errorMessage="Veuillez entrer un nom correct (entre 2 et 50 caractères)."
                                        width={300}
                                    />
                        }
                    </div>
                    <div className="buttons">
                        <Link to="/admin/CategoryManager" className="form-btn-error">Annuler</Link>
                        <button type="submit" className="form-btn-success" onClick={FormSubmitted}>Modifier</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CategoryEdit;