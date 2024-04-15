import { useContext, useEffect, useRef, useState } from "react";
import { Data } from "../../../services/api";
import { Item, Picker } from "@adobe/react-spectrum";
import { Link, useNavigate } from "react-router-dom";
import { ToastQueue } from "@react-spectrum/toast";
import { UserContext } from "../../../context/UserProvider";
import axios from "axios";


const ImageAdd = () => {

    const [getAllCategories, setAllCategories] = useState([]);
    const [getAllProducts, setAllProducts] = useState([]);
    const [formData, setFormData] = useState({
        "category_id": null,
        "product_id": null
    });
    const fileInputRef = useRef(null);

    // We are using those useEffect to make API calls to retrieve each categories and products

    let data = {
        "table": "categories"
    };

    useEffect(() => {
        Data("panelAdmin", "getAllFromTable", data).then(response => {
            if (response.success === true)
            {
                let array = response.data;
                array.unshift({id: null, name: "Lier cette image à aucune catégorie"});
                setAllCategories(array);
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
                let array = response.data;
                array.unshift({id: null, name: "Lier cette image à aucun produit"});
                setAllProducts(array);
            }
            else
            {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
    }, []);

    //We are now going to handle the form submission

    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();
    const { saveData } = useContext(UserContext);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if(file) {
            const allowedExtension = ["jpg", "jpeg", "png"];
            const selectedFileExtension = file.name.split(".").pop().toLowerCase();
            if(allowedExtension.includes(selectedFileExtension)) {
                setSelectedFile(file);
            } else {
                setSelectedFile(null);
                fileInputRef.current.value = '';
                ToastQueue.negative("Veuillez sélectionner un fichier d'un format accepté (png, jpg, jpeg)", {timeout: 5000});
            }
        } else {

        }
    };

    const FormSubmitted = async (e) => {
        e.preventDefault();
    
        // We are going to make one call API to upload the image to the image folder
        try {
            const urlUpload = "http://localhost:8000/actions/panelAdmin/uploadImage.php";

            const data = new FormData();
            data.append("file", selectedFile);

            axios.post(urlUpload, data).then(response => {
                if (response.data.success) {
                    // Then if it works successfuly, we are going to insert the image and all its details into the database
                    let data = {
                        "table": "images",
                        "data": {
                            "name": response.data.imageName,
                            "category_id": (formData.category_id === 'null') ? null : formData.category_id,
                            "product_id": (formData.product_id === 'null') ? null : formData.product_id
                        }
                    };
                    console.log(data);
                    Data("panelAdmin", "insert", data).then(response => {
                        if (response.success === true)
                        {
                            ToastQueue.positive("Modification réussite avec succès !", {timeout: 5000});
                            navigate("/admin/ImageManager");
                        }
                        else
                        {
                            // If we fail to update the database, we'll have to delete the imported image
                            const data_delete = {
                                "image": response.data.imageName
                            };

                            Data("panelAdmin", "deleteImage", data_delete);
                            ToastQueue.negative(response.error, {timeout: 5000});
                        }
                    });
                } else {
                    saveData("message", {type: "error", body: response.data.error}); // This line is used to store the message into the cookies to display it after the reload of the page
                    window.location.reload();
                }
            }).catch(error => console.log(error));
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
                                "product_id": formData.product_id
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
                                "product_id": selected
                            })}
                        >
                            {item => <Item key={item.id}>{item.name}</Item> }
                        </Picker>
                    </div>
                    <div>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange}/>
                    </div>
                    <div className="buttons">
                        <Link to="/admin/ImageManager" className="form-btn-error">Annuler</Link>
                        <button type="submit" className="form-btn-success" onClick={FormSubmitted}>Ajouter</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ImageAdd;