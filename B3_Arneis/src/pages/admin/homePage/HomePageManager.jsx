import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getData } from '../../../services/api';


const HomePageManager = () => {
    const [getEditModeSlider, setEditModeSlider] = useState(false);
    const [getEditMode, setEditMode] = useState(false);
    const [getEditModeData, setEditModeData] = useState([]);

    const enableEditModeSlider = () => {
        setEditModeSlider(true);
    };

    const disableEditModeSlider = () => {
        setEditModeSlider(false);
    }

    const enableEditMode = () => {
        setEditMode(true);
    };

    const disableEditMode = () => {
        setEditMode(false);
    }

    const [getSliderImages, setSliderImages] = useState([]);
    const [getTopCategories, setTopCategories] = useState([]);
    const [getTopProducts, setTopProducts] = useState([]);

    let data = {
        "table": "images"
    };

    useEffect(() => {
        getData("homePage", "getTop", data).then(response => {
            if (response.success === true)
            {
                setSliderImages(response.data);
            }
            else
            {
                console.log(response.error);
            }
        });
    }, []);

    let data2 = {
        "table": "categories"
    };

    useEffect(() => {
        getData("homePage", "getTop", data2).then(response => {
            if (response.success === true)
            {
                setTopCategories(response.data);
            }
            else
            {
                console.log(response.error);
            }
        });
    }, []);

    let data3 = {
        "table": "products"
    };

    useEffect(() => {
        getData("homePage", "getTop", data3).then(response => {
            if (response.success === true)
            {
                setTopProducts(response.data);
            }
            else
            {
                console.log(response.error);
            }
        });
    }, []);

    let data4 = {
        "table": "images"
    };

    useEffect(() => {
        getData("homePage", "getAllImages", data4).then(response => {
            if (response.success === true)
            {
                console.log(response.data);
                setEditModeData(response.data);
            }
            else
            {
                console.log(response.error);
            }
        });
    }, [getEditModeSlider]);

    return(
        <>
            <section className="homePage">
                <div className="homePageManager">
                    <div className="sliderManager">
                        <h1>Slider manager</h1>
                        <div className="box-container">
                            {getSliderImages && getSliderImages.map((image) => (
                                (image.order == 1)
                                ?
                                <div key={image.id} className="box">
                                    <img src={`/img/${image.name}`} alt=""/>
                                    <h3 className="position">Image #1</h3>
                                    <button onClick={enableEditModeSlider} className="btn">Modifier</button>
                                </div>
                                :
                                <div key={image.id + "_hidden"} style={{display: "none"}}></div>
                            ))}
                            {getSliderImages && getSliderImages.map((image) => (
                                (image.order == 2)
                                ?
                                <div key={image.id} className="box">
                                    <img src={`/img/${image.name}`} alt=""/>
                                    <h3 className="position">Image #2</h3>
                                    <button onClick={enableEditMode} className="btn">Modifier</button>
                                </div>
                                :
                                <div key={image.id + "_hidden"} style={{display: "none"}}></div>
                            ))}
                            {getSliderImages && getSliderImages.map((image) => (
                                (image.order == 3)
                                ?
                                <div key={image.id} className="box">
                                    <img src={`/img/${image.name}`} alt=""/>
                                    <h3 className="position">Image #3</h3>
                                    <button onClick={enableEditMode} className="btn">Modifier</button>
                                </div>
                                :
                                <div key={image.id + "_hidden"} style={{display: "none"}}></div>
                            ))}
                        </div>
                    </div>
                    <div className="topCategoriesManager">
                        <h1>Top Catégories manager</h1>
                        <div className="box-container">
                            {getTopCategories && getTopCategories.map((category) => (
                                (category.category_order == 1)
                                ?
                                <div key={category.category_id} className="box">
                                    <img src={`/img/${category.image_name}`} alt=""/>
                                    <h3 className="position">{category.category_name}</h3>
                                    <Link to="/" className="btn">Modifier</Link>
                                </div>
                                :
                                <div key={category.category_id + "_hidden"} style={{display: "none"}}></div>
                            ))}
                            {getTopCategories && getTopCategories.map((category) => (
                                (category.category_order == 2)
                                ?
                                <div key={category.category_id} className="box">
                                    <img src={`/img/${category.image_name}`} alt=""/>
                                    <h3 className="position">{category.category_name}</h3>
                                    <Link to="/" className="btn">Modifier</Link>
                                </div>
                                :
                                <div key={category.category_id + "_hidden"} style={{display: "none"}}></div>
                            ))}
                            {getTopCategories && getTopCategories.map((category) => (
                                (category.category_order == 3)
                                ?
                                <div key={category.category_id} className="box">
                                    <img src={`/img/${category.image_name}`} alt=""/>
                                    <h3 className="position">{category.category_name}</h3>
                                    <Link to="/" className="btn">Modifier</Link>
                                </div>
                                :
                                <div key={category.category_id + "_hidden"} style={{display: "none"}}></div>
                            ))}
                        </div>
                    </div>
                    <div className="topProductsManager">
                        <h1>Top Produits manager</h1>
                        <div className="box-container">
                            {getTopProducts && getTopProducts.map((product) => (
                                (product.product_order == 1)
                                ?
                                <div key={product.product_id} className="box">
                                    <img src={`/img/${product.image_name}`} alt=""/>
                                    <h3 className="position">{product.product_name}</h3>
                                    <Link to="/" className="btn">Modifier</Link>
                                </div>
                                :
                                <div key={product.category_id + "_hidden"} style={{display: "none"}}></div>
                            ))}
                            {getTopProducts && getTopProducts.map((product) => (
                                (product.product_order == 2)
                                ?
                                <div key={product.product_id} className="box">
                                    <img src={`/img/${product.image_name}`} alt=""/>
                                    <h3 className="position">{product.product_name}</h3>
                                    <Link to="/" className="btn">Modifier</Link>
                                </div>
                                :
                                <div key={product.category_id + "_hidden"} style={{display: "none"}}></div>
                            ))}
                            {getTopProducts && getTopProducts.map((product) => (
                                (product.product_order == 3)
                                ?
                                <div key={product.product_id} className="box">
                                    <img src={`/img/${product.image_name}`} alt=""/>
                                    <h3 className="position">{product.product_name}</h3>
                                    <Link to="/" className="btn">Modifier</Link>
                                </div>
                                :
                                <div key={product.category_id + "_hidden"} style={{display: "none"}}></div>
                            ))}
                        </div>
                    </div>
                    {
                        (getEditModeSlider)
                        ?
                            <>
                                <div className="editMode">
                                    <form action="http://localhost:8000/actions/homePage/homePageManager.php" method="post" encType="multipart/form-data">
                                        <h1 className="editTitle">Modifier l'élément sélectionné</h1>
                                        <div>
                                            <h3>Prévisualisation de l'image</h3>
                                            <img src="/img/1-1-chaise-design-blanc-et-bois-clair-.jpg" alt=""/>
                                        </div>
                                        <div>
                                            <label htmlFor="selectImage">Sélectionner parmis les images déjà existantes:</label>
                                            <select name="selectImage" id="selectImage">
                                                <option selected value=""></option>
                                                {getEditModeData && getEditModeData.map((image) => (
                                                    <option value={image.id}>{image.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button type="submit" className="form-btn-success">Modifier</button>
                                        <button onClick={disableEditMode} className="form-btn-error">Annuler</button>
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