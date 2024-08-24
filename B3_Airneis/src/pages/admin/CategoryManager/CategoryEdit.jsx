import { useEffect,useState } from "react";
import { Data } from "../../../services/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastQueue } from "@react-spectrum/toast";
import { TextField } from "@adobe/react-spectrum";


const CategoryEdit = () => {

    // Setting use states
    const [getCategoryName, setCategoryName] = useState([]);
    const [validState, setValidState] = useState(1);

    const { categoryId } = useParams(); // Retrieving the category ID from URL parameters

    // Make an API call to get the category informations
    let data = {
        "table": "categories",
        "id": categoryId
    };

    useEffect(() => {
        Data("panelAdmin", "getWhere", data).then(response => {
            if (response.success === true)
            {
                setCategoryName(response.data[0].name)
            }
            else
            {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
    }, []);

    // Check the validation of the inputs
    useEffect(() => {
        if(getCategoryName.length < 2 || getCategoryName.length > 49) {
            setValidState(2);
        } else {
            setValidState(1);
        }
    }, [getCategoryName]);

    //We are now going to handle the form submission
    const navigate = useNavigate();

    const FormSubmitted = async (e) => {
        e.preventDefault();

        if(validState === 1) {
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
            ToastQueue.negative("Veuillez entrer un nom de catégorie valide (entre 2 et 50 caractères).", {timeout: 5000});
        }
    };

    return(
        <>
            <div className="panelAdminAddElement">
                <form onSubmit={FormSubmitted}>
                    <h1 className="formTitle">Modifier une catégorie</h1>
                    <div>
                        {
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