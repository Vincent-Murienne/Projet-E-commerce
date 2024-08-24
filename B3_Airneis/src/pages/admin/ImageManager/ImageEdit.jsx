import { useContext, useEffect, useRef, useState } from "react";
import { Data } from "../../../services/api";
import { Item, Picker, Checkbox } from "@adobe/react-spectrum";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastQueue } from "@react-spectrum/toast";
import { UserContext } from "../../../context/UserProvider";
import axios from "axios";


const ImageEdit = () => {

    // Setting use states
    const [getAllCategories, setAllCategories] = useState([]);
    const [getAllProducts, setAllProducts] = useState([]);
    const [getImageDetails, setImageDetails] = useState([]);
    const [isSelected, setSelected] = useState(false);
    const [getCategory, setCategory] = useState(undefined);
    const [getProduct, setProduct] = useState(undefined);
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
                let array = response.data;
                array.unshift({id: null, name: "Lier cette image à aucun produit"});
                setAllProducts(response.data);
            }
            else
            {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
    }, []);

    const { imageId } = useParams(); // Retrieving the category ID from URL parameters
    let data3 = {
        "table": "images",
        "id": imageId
    };

    useEffect(() => {
        Data("panelAdmin", "getWhere", data3).then(response => {
            if (response.success === true)
            {
                setImageDetails(response.data[0]);
            }
            else
            {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
    }, []);

    // We are setting the categories and products linked to that image
    useEffect(() => {
        if(getImageDetails.category_id !== undefined && getImageDetails.category_id !== null && getImageDetails.category_id !== "null") {
            setCategory(getImageDetails.category_id.toString());
        } else {
            setCategory(getImageDetails.category_id);
        }
        
        if(getImageDetails.product_id !== undefined && getImageDetails.product_id !== null && getImageDetails.product_id !== "null") {
            setProduct(getImageDetails.product_id.toString());
        } else {
            setProduct(getImageDetails.product_id);
        }
    }, [getImageDetails]);

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

        if(isSelected) {
            // If true, we are going to want to also replace the image
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
                            "id": getImageDetails.id,
                            "data": {
                                "name": response.data.imageName,
                                "category_id": (getCategory === 'null') ? null : getCategory,
                                "product_id": (getProduct === 'null') ? null : getProduct
                            }
                        };
                        Data("panelAdmin", "update", data).then(response => {
                            if (response.success === true)
                            {
                                // We now want to remove the old image from our image folder
                                Data("panelAdmin", "deleteImage", {"image": getImageDetails.name});

                                ToastQueue.positive("Modification réussite avec succès !", {timeout: 5000});
                                navigate("/admin/ImageManager");
                            }
                            else
                            {
                                // If we fail to update the database, we'll have to delete the imported image
                                Data("panelAdmin", "deleteImage", {"image": response.data.imageName});

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
        } else {
            // If false, we don't have to replace the image
            let data = {
                "table": "images",
                "id": getImageDetails.id,
                "data": {
                    "category_id": (getCategory === 'null') ? null : getCategory,
                    "product_id": (getProduct === 'null') ? null : getProduct
                }
            };

            Data("panelAdmin", "update", data).then(response => {
                if (response.success === true)
                {
                    ToastQueue.positive("Modification réussite avec succès !", {timeout: 5000});
                    navigate("/admin/ImageManager");
                }
                else
                {
                    ToastQueue.negative(response.error, {timeout: 5000});
                }
            });
        }
    };

    return(
        <>
            <div className="panelAdminAddElement">
                <form onSubmit={FormSubmitted}>
                    <h1 className="formTitle">Modifier une image</h1>
                    <div>
                        <Picker
                            label="Lier cette image à une catégorie"
                            necessityIndicator="label"
                            minWidth={300}
                            items={getAllCategories}
                            selectedKey={getCategory}
                            onSelectionChange={selected => setCategory(selected)}
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
                            selectedKey={getProduct}
                            onSelectionChange={selected => setProduct(selected)}
                        >
                            {item => <Item key={item.id}>{item.name}</Item> }
                        </Picker>
                    </div>
                    <div>
                        <label>Image actuelle:</label>
                        <img src={`/img/${getImageDetails.name}`} alt="" style={{width: "300px", maxHeight: "300px"}}/>
                    </div>
                    <div>
                        <Checkbox onChange={setSelected}>
                            Voulez-vous modifier l'image actuelle ?
                        </Checkbox>
                    </div>
                    {
                        (isSelected)
                        ?
                            <>
                                <div>
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange}/>
                                </div>
                            </>
                        :
                            <></>
                    }
                    <div className="buttons">
                        <Link to="/admin/ImageManager" className="form-btn-error">Annuler</Link>
                        <button type="submit" className="form-btn-success" onClick={FormSubmitted}>Modifier</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ImageEdit;