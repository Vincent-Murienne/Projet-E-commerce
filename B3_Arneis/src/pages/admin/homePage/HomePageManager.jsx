import { useEffect, useState } from "react";
import { Data } from '../../../services/api';
import { ToastQueue } from "@react-spectrum/toast";


const HomePageManager = () => {
    // Mise en place des useState et des fonctions permettant d'afficher correctement la page de modification des top 3 de chaque sections
    
    const [formData, setFormData] = useState({
        id: "",
        table: "",
        order: ""
    });

    const [getReload, setReload] = useState(false);
    const [getEditMode, setEditMode] = useState(false);
    const [getEditModeData, setEditModeData] = useState([]);
    const [getAllImages, setAllImages] = useState([]);
    const [getAllCategories, setAllCategories] = useState([]);
    const [getAllProducts, setAllProducts] = useState([]);

    const enableEditMode = (data) => {
        setEditMode(true);
        setFormData({"id": data.id, "table": data.table, "order": data.order});
        switch(data.table) {
            case "images":
                setEditModeData(getAllImages);
                if(data.id === "") {
                    setFormData({"id": getAllImages[0].id, "table": data.table, "order": data.order});
                }
                break;
            case "categories":
                setEditModeData(getAllCategories);
                if(data.id === "") {
                    setFormData({"id": getAllCategories[0].id, "table": data.table, "order": data.order});
                }
                break;
            case "products":
                setEditModeData(getAllProducts);
                if(data.id === "") {
                    setFormData({"id": getAllProducts[0].id, "table": data.table, "order": data.order});
                }
                break;
        }
    };

    const disableEditMode = () => {
        setEditMode(false);
        setFormData({"id": "", "table": "", "order": ""});
    };

    // Récupération des top 3 de chaques catégories afin des les afficher.

    const [getSliderImages, setSliderImages] = useState([]);
    const [getTopCategories, setTopCategories] = useState([]);
    const [getTopProducts, setTopProducts] = useState([]);

    let data = {
        "table": "images"
    };

    useEffect(() => {
        setReload(false);
        Data("panelAdmin", "getTop", data).then(response => {
            if (response.success === true)
            {
                // On vient vérifier qu'on a bien 3 éléments distincts dans notre tableau, dans le cas contraire on viendra normaliser celui-ci afin d'éviter les erreurs lors de l'intégration des données dans le front.
                if(response.data.length === 3) {
                    setSliderImages(response.data);
                } else {

                    let item1 = {"id": "", "name": ""};
                    let item2 = {"id": "", "name": ""};
                    let item3 = {"id": "", "name": ""};
                    response.data.map((item, index) => {
                        switch(item.order) {
                            case "1":
                                item1 = response.data[index];
                                break;
                            case "2":
                                item2 = response.data[index];
                                break;
                            case "3":
                                item3 = response.data[index];
                                break;
                        }
                    })
                    let newData = [item1, item2, item3];
                    setSliderImages(newData);
                }
            }
            else
            {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
        Data("panelAdmin", "getAllFromTable", data).then(response => {
            if (response.success === true)
            {
                setAllImages(response.data);
            }
            else
            {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
    }, [getReload]);

    let data2 = {
        "table": "categories"
    };

    useEffect(() => {
        setReload(false);
        Data("panelAdmin", "getTop", data2).then(response => {
            if (response.success === true)
            {
                // On vient vérifier qu'on a bien 3 éléments distincts dans notre tableau, dans le cas contraire on viendra normaliser celui-ci afin d'éviter les erreurs lors de l'intégration des données dans le front.
                if(response.data.length === 3) {
                    setTopCategories(response.data);
                } else {

                    let item1 = {"category_id": "", "image_name": "", "category_name": ""};
                    let item2 = {"category_id": "", "image_name": "", "category_name": ""};
                    let item3 = {"category_id": "", "image_name": "", "category_name": ""};
                    response.data.map((item, index) => {
                        switch(item.category_order) {
                            case "1":
                                item1 = response.data[index];
                                break;
                            case "2":
                                item2 = response.data[index];
                                break;
                            case "3":
                                item3 = response.data[index];
                                break;
                        }
                    })
                    let newData = [item1, item2, item3];
                    setTopCategories(newData);
                }
            }
            else
            {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
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
    }, [getReload]);

    let data3 = {
        "table": "products"
    };

    useEffect(() => {
        setReload(false);
        Data("panelAdmin", "getTop", data3).then(response => {
            if (response.success === true)
            {
                // On vient vérifier qu'on a bien 3 éléments distincts dans notre tableau, dans le cas contraire on viendra normaliser celui-ci afin d'éviter les erreurs lors de l'intégration des données dans le front.
                if(response.data.length === 3) {
                    setTopProducts(response.data);
                } else {

                    let item1 = {"product_id": "", "image_name": "", "product_name": ""};
                    let item2 = {"product_id": "", "image_name": "", "product_name": ""};
                    let item3 = {"product_id": "", "image_name": "", "product_name": ""};
                    response.data.map((item, index) => {
                        switch(item.product_order) {
                            case "1":
                                item1 = response.data[index];
                                break;
                            case "2":
                                item2 = response.data[index];
                                break;
                            case "3":
                                item3 = response.data[index];
                                break;
                        }
                    })
                    let newData = [item1, item2, item3];
                    setTopProducts(newData);
                }
            }
            else
            {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
        Data("panelAdmin", "getAllFromTable", data3).then(response => {
            if (response.success === true)
            {
                setAllProducts(response.data);
            }
            else
            {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
    }, [getReload]);

    // Fonctions de gestion des modifications des top 3 de chaque sections.

    const handleSelect = (e) => {
        setFormData({"id": e.target.value, "table": formData.table, "order": formData.order});
    }

    const FormSubmitted = async (e) => {
        e.preventDefault();
    
        try {
            const response = await Data("panelAdmin", "updateTop", formData);
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
            <section className="homePage">
                <div className="homePageManager">
                    <div className="sliderManager">
                        <h1>Slider manager</h1>
                        <div className="box-container">
                        {
                                (getSliderImages)
                                ?
                                    <>
                                        {getSliderImages.length > 0 && (
                                            <div key="slider1" className="box">
                                                <img src={`/img/${getSliderImages[0].name}`} alt=""/>
                                                <h3 className="position">Image #1</h3>
                                                <button onClick={() => enableEditMode({"table": "images", "id": getSliderImages[0].id, "order": 1})} className="btn">Modifier</button>
                                            </div>
                                        )}
                                    </>
                                :
                                <></>
                            }
                            {
                                (getSliderImages)
                                ?
                                    <>
                                        {getSliderImages.length > 0 && (
                                            <div key="slider2" className="box">
                                                <img src={`/img/${getSliderImages[1].name}`} alt=""/>
                                                <h3 className="position">Image #2</h3>
                                                <button onClick={() => enableEditMode({"table": "images", "id": getSliderImages[1].id, "order": 2})} className="btn">Modifier</button>
                                            </div>
                                        )}
                                    </>
                                :
                                <></>
                            }
                            {
                                (getSliderImages)
                                ?
                                    <>
                                        {getSliderImages.length > 0 && (
                                            <div key="slider3" className="box">
                                                <img src={`/img/${getSliderImages[2].name}`} alt=""/>
                                                <h3 className="position">Image #3</h3>
                                                <button onClick={() => enableEditMode({"table": "images", "id": getSliderImages[2].id, "order": 3})} className="btn">Modifier</button>
                                            </div>
                                        )}
                                    </>
                                :
                                <></>
                            }
                        </div>
                    </div>
                    <div className="topCategoriesManager">
                        <h1>Top Catégories manager</h1>
                        <div className="box-container">
                            {
                                (getTopCategories)
                                ?
                                    <>
                                        {getTopCategories.length > 0 && (
                                            <div key="category1" className="box">
                                                <img src={`/img/${getTopCategories[0].image_name}`} alt=""/>
                                                <h3 className="position">{getTopCategories[0].category_name}</h3>
                                                <button onClick={() => enableEditMode({"table": "categories", "id": getTopCategories[0].category_id, "order": 1})} className="btn">Modifier</button>
                                            </div>
                                        )}
                                    </>
                                :
                                <></>
                            }
                            {
                                (getTopCategories)
                                ?
                                    <>
                                        {getTopCategories.length > 0 && (
                                            <div key="category2" className="box">
                                                <img src={`/img/${getTopCategories[1].image_name}`} alt=""/>
                                                <h3 className="position">{getTopCategories[1].category_name}</h3>
                                                <button onClick={() => enableEditMode({"table": "categories", "id": getTopCategories[1].category_id, "order": 2})} className="btn">Modifier</button>
                                            </div>
                                        )}
                                    </>
                                :
                                <></>
                            }
                            {
                                (getTopCategories)
                                ?
                                    <>
                                        {getTopCategories.length > 0 && (
                                            <div key="category3" className="box">
                                                <img src={`/img/${getTopCategories[2].image_name}`} alt=""/>
                                                <h3 className="position">{getTopCategories[2].category_name}</h3>
                                                <button onClick={() => enableEditMode({"table": "categories", "id": getTopCategories[2].category_id, "order": 3})} className="btn">Modifier</button>
                                            </div>
                                        )}
                                    </>
                                :
                                <></>
                            }
                        </div>
                    </div>
                    <div className="topProductsManager">
                        <h1>Top Produits manager</h1>
                        <div className="box-container">
                            {
                                (getTopProducts)
                                ?
                                    <>
                                        {getTopProducts.length > 0 && (
                                            <div key="product1" className="box">
                                                <img src={`/img/${getTopProducts[0].image_name}`} alt=""/>
                                                <h3 className="position">{getTopProducts[0].product_name}</h3>
                                                <button onClick={() => enableEditMode({"table": "products", "id": getTopProducts[0].product_id, "order": 1})} className="btn">Modifier</button>
                                            </div>
                                        )}
                                    </>
                                :
                                <></>
                            }
                            {
                                (getTopProducts)
                                ?
                                    <>
                                        {getTopProducts.length > 0 && (
                                            <div key="product2" className="box">
                                                <img src={`/img/${getTopProducts[1].image_name}`} alt=""/>
                                                <h3 className="position">{getTopProducts[1].product_name}</h3>
                                                <button onClick={() => enableEditMode({"table": "products", "id": getTopProducts[1].product_id, "order": 2})} className="btn">Modifier</button>
                                            </div>
                                        )}
                                    </>
                                :
                                <></>
                            }
                            {
                                (getTopProducts)
                                ?
                                    <>
                                        {getTopProducts.length > 0 && (
                                            <div key="product3" className="box">
                                                <img src={`/img/${getTopProducts[2].image_name}`} alt=""/>
                                                <h3 className="position">{getTopProducts[2].product_name}</h3>
                                                <button onClick={() => enableEditMode({"table": "products", "id": getTopProducts[2].product_id, "order": 3})} className="btn">Modifier</button>
                                            </div>
                                        )}
                                    </>
                                :
                                <></>
                            }
                        </div>
                    </div>
                    {
                        (getEditMode)
                        ?
                            <>
                                <div className="editMode">
                                    <form onSubmit={FormSubmitted}>
                                        <h1 className="editTitle">Modifier l'élément sélectionné</h1>
                                        <div>
                                            <label htmlFor="selectImage">Sélectionner parmis les éléments déjà existants:</label>
                                            <select id="selectImage" value={formData.id} onChange={handleSelect}>
                                                {getEditModeData && getEditModeData.map((element) => (
                                                    <option key={"editMode" + element.id} value={element.id}>{element.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button type="submit" className="form-btn-success">Modifier</button>
                                        <button type="reset" onClick={disableEditMode} className="form-btn-error">Annuler</button>
                                    </form>
                                </div>
                            </>
                        :
                            <></>
                    }
                </div>
            </section>
        </>
    );
};

export default HomePageManager;