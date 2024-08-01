import { useEffect, useState } from "react";
import { Data } from "../../../services/api";
import { TextField } from "@adobe/react-spectrum";
import { Link, useNavigate } from "react-router-dom";
import { ToastQueue } from "@react-spectrum/toast";


const CategoryAdd = () => {

    // Setting use states
    const [getCategoryName, setCategoryName] = useState(null);
    const [validState, setValidState] = useState(0);

    // Check the validation of the inputs
    useEffect(() => {
        if(getCategoryName !== null) {
            if(getCategoryName.length < 2 || getCategoryName.length > 49) {
                setValidState(2);
            } else {
                setValidState(1);
            }
        }
    }, [getCategoryName]);

    //We are now going to handle the form submission
    const navigate = useNavigate();

    const FormSubmitted = async (e) => {
        e.preventDefault();

        if(validState === 1) {
            // We are going to add the category to the database
            let data = {
                "table": "categories",
                "data": {
                    "name": getCategoryName
                }
            };

            Data("panelAdmin", "insert", data).then(response => {
                if (response.success === true)
                {
                    ToastQueue.positive("Création réussite avec succès !", {timeout: 5000});
                    navigate("/admin/CategoryManager");
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
                    <h1 className="formTitle">Ajouter une catégorie</h1>
                    <div>
                        {
                            (validState === 0)
                            ?
                                <TextField
                                    label="Nom de la catégorie"
                                    onChange={setCategoryName}
                                    isRequired
                                    width={300}
                                />
                            :
                                (validState === 1)
                                ?
                                    <TextField
                                        label="Nom de la catégorie"
                                        onChange={setCategoryName}
                                        isRequired 
                                        validationState="valid"
                                        errorMessage="Veuillez entrer un nom correct (entre 2 et 50 caractères)."
                                        width={300}
                                    />
                                :
                                    <TextField
                                        label="Nom de la catégorie"
                                        onChange={setCategoryName}
                                        isRequired 
                                        validationState="invalid"
                                        errorMessage="Veuillez entrer un nom correct (entre 2 et 50 caractères)."
                                        width={300}
                                    />
                        }
                    </div>
                    <div className="buttons">
                        <Link to="/admin/CategoryManager" className="form-btn-error">Annuler</Link>
                        <button type="submit" className="form-btn-success" onClick={FormSubmitted}>Ajouter</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CategoryAdd;