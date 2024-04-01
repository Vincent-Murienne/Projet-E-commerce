import { useEffect, useState } from "react";
import { Data } from "../../../services/api";
import { Item, Picker } from "@adobe/react-spectrum";
import { Link } from "react-router-dom";


const ImageAdd = () => {

    const [isFilled, setIsFilled] = useState(false);
    const [getAllCategories, setAllCategories] = useState([]);
    const [getAllProducts, setAllProducts] = useState([]);
    const [formData, setFormData] = useState({
        "category_id": null,
        "product_id": null,
        "name": ""
    });

    // We are using those useEffect to make API calls to retrieve each categories and products

    let data = {
        "table": "categories"
    };

    useEffect(() => {
        Data("panelAdmin", "getAllFromTable", data).then(response => {
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

    let data2 = {
        "table": "products"
    };

    useEffect(() => {
        Data("panelAdmin", "getAllFromTable", data2).then(response => {
            if (response.success === true)
            {
                setAllProducts(response.data);
            }
            else
            {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
    }, []);

    //We are now going to handle the form submission

    const FormSubmitted = async (e) => {
        e.preventDefault();
    
        try {
            const response = await Data("panelAdmin", "addImage", formData);
            if (response.success) {
                setReload(true);
                disableEditMode();
                ToastQueue.positive("Modification réussite avec succès !", {timeout: 5000});
            } else {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        } catch (error) {
            ToastQueue.negative("Une erreur est survenue lors de la modification en base de donnée.", {timeout: 5000});
        }
    };

    return(
        <>
            <div className="panelAdminAddElement">
                <form onSubmit={FormSubmitted}>
                    <h1 className="formTitle">Ajouter une image</h1>
                    <div>
                        <Picker
                            label="Lier cette image à une catégorie"
                            necessityIndicator="label"
                            minWidth={300}
                            items={getAllCategories}
                            onSelectionChange={selected => setFormData({
                                "category_id": selected,
                                "product_id": formData.product_id,
                                "name": formData.name
                            })}
                        >
                            {item => <Item key={item.id}>{item.name}</Item> }
                        </Picker>
                    </div>
                    <div>
                        <Picker
                            label="Lier cette image à un produit"
                            necessityIndicator="label"
                            minWidth={300}
                            items={getAllProducts}
                            onSelectionChange={selected => setFormData({
                                "category_id": formData.category_id,
                                "product_id": selected,
                                "name": formData.name
                            })}
                        >
                            {item => <Item key={item.id}>{item.name}</Item> }
                        </Picker>
                    </div>
                    <div>
                        <input type="file" />
                    </div>
                    <div className="buttons">
                        <Link to="/admin/ImageManager" className="form-btn-error">Annuler</Link>
                        <button type="submit" className="form-btn-success">Ajouter</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ImageAdd;