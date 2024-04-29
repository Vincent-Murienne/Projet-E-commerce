import { useEffect,useState } from "react";
import { Data } from "../../../services/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastQueue } from "@react-spectrum/toast";
import { Item, NumberField, Picker, TextArea, TextField } from "@adobe/react-spectrum";


const UserEdit = () => {

    const [getProductName, setProductName] = useState(undefined);
    const [getProductNameValidState, setProductNameValidState] = useState(1);
    const [getPrice, setPrice] = useState(undefined);
    const [getPriceValidState, setPriceValidState] = useState(1);
    const [getQuantity, setQuantity] = useState(undefined);
    const [getDescription, setDescription] = useState(undefined);
    const [getDescriptionValidState, setDescriptionValidState] = useState(1);
    const [getAllCategories, setAllCategories] = useState([]);
    const [getCategoryId, setCategoryId] = useState(undefined);

    const { productId } = useParams(); // Retrieving the product ID from URL parameters
    let data = {
        "table": "products",
        "id": productId
    };

    useEffect(() => {
        Data("panelAdmin", "getWhere", data).then(response => {
            if (response.success === true)
            {
                console.log(response.data[0]);
                setCategoryId(response.data[0].category_id);
                setProductName(response.data[0].name);
                setPrice(response.data[0].price);
                setQuantity(response.data[0].quantity);
                setDescription(response.data[0].description);
            }
            else
            {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
    }, []);

    // Lets make an API call to retrieve each categories

    let data2 = {
        "table": "categories"
    };

    useEffect(() => {
        Data("panelAdmin", "getAllFromTable", data2).then(response => {
            if (response.success === true)
            {
                setAllCategories(response.data);
            }
            else
            {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
    }, []);

    useEffect(() => {
        if(getProductName !== undefined && (getProductName.length < 2 || getProductName.length > 49)) {
            setProductNameValidState(2);
        } else {
            setProductNameValidState(1);
        }
    }, [getProductName]);

    useEffect(() => {
        if(getPrice === 0) {
            setPriceValidState(2);
        } else {
            setPriceValidState(1);
        }
    }, [getPrice]);

    useEffect(() => {
        if(getDescription !== undefined && (getDescription.length < 10 || getDescription.length > 500)) {
            setDescriptionValidState(2);
        } else {
            setDescriptionValidState(1);
        }
    }, [getDescription]);

    //We are now going to handle the form submission
    const navigate = useNavigate();

    const FormSubmitted = async (e) => {
        e.preventDefault();

        if(getProductNameValidState === 1 && getPriceValidState === 1 && getDescriptionValidState === 1) {
            let data = {
                "table": "products",
                "id": productId,
                "data": {
                    "category_id": getCategoryId,
                    "name": getProductName,
                    "price": getPrice,
                    "quantity": getQuantity,
                    "description": getDescription
                }
            };
    
            Data("panelAdmin", "update", data).then(response => {
                if (response.success === true)
                {
                    ToastQueue.positive("Modification réussite avec succès !", {timeout: 5000});
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
                    <h1 className="formTitle">Modifier un produit</h1>
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
                            (getProductNameValidState === 1)
                            ?
                                <TextField
                                    label="Nom du produit"
                                    onChange={setProductName}
                                    value={getProductName}
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
                            (getPriceValidState === 1)
                            ?
                                <NumberField
                                    label="Prix"
                                    onChange={setPrice}
                                    value={getPrice}
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
                                    value={getPrice}
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
                            value={getQuantity}
                            minValue={0}
                            width={300}
                        />
                    </div>
                    <div>
                        {
                            (getDescriptionValidState === 1)
                            ?
                                <TextArea
                                    label="Description"
                                    onChange={setDescription}
                                    value={getDescription}
                                    isRequired
                                    maxLength={500}
                                    width={300}
                                    validationState="valid"
                                />
                            :
                                <TextArea
                                    label="Description"
                                    onChange={setDescription}
                                    value={getDescription}
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
                        <button type="submit" className="form-btn-success" onClick={FormSubmitted}>Modifier</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default UserEdit;