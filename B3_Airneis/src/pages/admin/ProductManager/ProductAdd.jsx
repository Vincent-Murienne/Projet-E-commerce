import { useEffect, useState } from "react";
import { Data } from "../../../services/api";
import { Item, NumberField, Picker, TextArea, TextField } from "@adobe/react-spectrum";
import { Link, useNavigate } from "react-router-dom";
import { ToastQueue } from "@react-spectrum/toast";


const ProductAdd = () => {

    // Setting use states
    const [getProductName, setProductName] = useState(null);
    const [getProductNameValidState, setProductNameValidState] = useState(0);
    const [getPrice, setPrice] = useState(null);
    const [getPriceValidState, setPriceValidState] = useState(0);
    const [getQuantity, setQuantity] = useState(0);
    const [getDescription, setDescription] = useState(null);
    const [getDescriptionValidState, setDescriptionValidState] = useState(0);
    const [getAllCategories, setAllCategories] = useState([]);
    const [getCategoryId, setCategoryId] = useState(null);

    // Lets make an API call to retrieve each categories
    let data = {
        "table": "categories"
    };

    useEffect(() => {
        Data("panelAdmin", "getAllFromTable", data).then(response => {
            if (response.success === true)
            {
                setAllCategories(response.data);
                setCategoryId(response.data[0].id.toString());
            }
            else
            {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
    }, []);

    // Handle the validation of each input
    useEffect(() => {
        if(getProductName !== null) {
            if(getProductName.length < 2 || getProductName.length > 49) {
                setProductNameValidState(2);
            } else {
                setProductNameValidState(1);
            }
        }
    }, [getProductName]);

    useEffect(() => {
        if(getPrice !== null) {
            if(getPrice === 0) {
                setPriceValidState(2);
            } else {
                setPriceValidState(1);
            }
        }
    }, [getPrice]);

    useEffect(() => {
        if(getDescription !== null) {
            if(getDescription.length < 10 || getDescription.length > 500) {
                setDescriptionValidState(2);
            } else {
                setDescriptionValidState(1);
            }
        }
    }, [getDescription]);

    //We are now going to handle the form submission
    const navigate = useNavigate();

    const FormSubmitted = async (e) => {
        e.preventDefault();
    
        if(getCategoryId !== null && getProductNameValidState === 1 && getPriceValidState === 1 && getDescriptionValidState === 1) {
            // We are going to add the product to the database
            let data = {
                "table": "products",
                "data": {
                    "category_id": getCategoryId,
                    "name": getProductName,
                    "price": getPrice,
                    "quantity": getQuantity,
                    "description": getDescription
                }
            };

            Data("panelAdmin", "insert", data).then(response => {
                if (response.success === true)
                {
                    ToastQueue.positive("Création réussite avec succès !", {timeout: 5000});
                    navigate("/admin/ProductManager");
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
                    <h1 className="formTitle">Ajouter un produit</h1>
                    <div>
                        <Picker
                            label="Lier ce produit à une catégorie"
                            necessityIndicator="label"
                            isRequired
                            minWidth={300}
                            items={getAllCategories}
                            selectedKey={getCategoryId}
                            onSelectionChange={selected => setCategoryId(selected)}
                        >
                            {item => <Item key={item.id}>{item.name}</Item> }
                        </Picker>
                    </div>
                    <div>
                        {
                            (getProductNameValidState === 0)
                            ?
                                <TextField
                                    label="Nom du produit"
                                    onChange={setProductName}
                                    isRequired
                                    width={300}
                                />
                            :
                                (getProductNameValidState === 1)
                                ?
                                    <TextField
                                        label="Nom du produit"
                                        onChange={setProductName}
                                        isRequired 
                                        validationState="valid"
                                        width={300}
                                    />
                                :
                                    <TextField
                                        label="Nom du produit"
                                        onChange={setProductName}
                                        isRequired 
                                        validationState="invalid"
                                        errorMessage="Veuillez entrer un nom correct (entre 2 et 50 caractères)."
                                        width={300}
                                    />
                        }
                    </div>
                    <div>
                        {
                            (getPriceValidState === 0)
                            ?
                                <NumberField
                                    label="Prix"
                                    onChange={setPrice}
                                    defaultValue={0}
                                    minValue={0}
                                    formatOptions={{
                                        style: 'currency',
                                        currency: 'EUR',
                                        currencyDisplay: 'code',
                                        currencySign: 'accounting'
                                    }}
                                    width={300}
                                    isRequired
                                />
                            :
                                (getPriceValidState === 1)
                                ?
                                    <NumberField
                                        label="Prix"
                                        onChange={setPrice}
                                        defaultValue={0}
                                        minValue={0}
                                        formatOptions={{
                                            style: 'currency',
                                            currency: 'EUR',
                                            currencyDisplay: 'code',
                                            currencySign: 'accounting'
                                        }}
                                        width={300}
                                        isRequired
                                        validationState="valid"
                                    />
                                :
                                    <NumberField
                                        label="Prix"
                                        onChange={setPrice}
                                        defaultValue={0}
                                        minValue={0}
                                        formatOptions={{
                                            style: 'currency',
                                            currency: 'EUR',
                                            currencyDisplay: 'code',
                                            currencySign: 'accounting'
                                        }}
                                        width={300}
                                        isRequired
                                        validationState="invalid"
                                        errorMessage="Veuillez entrer un prix différent de 0."
                                    />
                        }
                    </div>
                    <div>
                        <NumberField
                            label="Quantité"
                            onChange={setQuantity}
                            defaultValue={0}
                            minValue={0}
                            width={300}
                        />
                    </div>
                    <div>
                        {
                            (getDescriptionValidState === 0)
                            ?
                                <TextArea
                                    label="Description"
                                    onChange={setDescription}
                                    isRequired
                                    maxLength={500}
                                    width={300}
                                />
                            :
                                (getDescriptionValidState === 1)
                                ?
                                    <TextArea
                                        label="Description"
                                        onChange={setDescription}
                                        isRequired
                                        maxLength={500}
                                        width={300}
                                        validationState="valid"
                                    />
                                :
                                    <TextArea
                                        label="Description"
                                        onChange={setDescription}
                                        isRequired
                                        maxLength={500}
                                        width={300}
                                        validationState="invalid"
                                        errorMessage="Veuillez entrer une description correcte (entre 10 et 500 caractères)."
                                    />
                        }
                    </div>
                    <div className="buttons">
                        <Link to="/admin/ProductManager" className="form-btn-error">Annuler</Link>
                        <button type="submit" className="form-btn-success" onClick={FormSubmitted}>Ajouter</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ProductAdd;