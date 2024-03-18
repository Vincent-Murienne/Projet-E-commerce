import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getData } from '../../../services/api';


const HomePageManager = () => {
    const [getEditModeSlider, setEditModeSlider] = useState(false);
    const [getEditMode, setEditMode] = useState(false);
    const [getEditModeData, setEditModeData] = useState([]);

    const enableEditModeSlider = (data) => {
        setEditModeSlider(true);
        setEditModeData(data);
    };

    const disableEditModeSlider = () => {
        setEditModeSlider(false);
        setEditModeData([]);
    }

    const enableEditMode = (data) => {
        setEditMode(true);
        setEditModeData(data);
    };

    const disableEditMode = () => {
        setEditMode(false);
        setEditModeData([]);
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
                        {
                                (getSliderImages)
                                ?
                                    <>
                                        {getSliderImages.length > 0 && (
                                            <div key="slider1" className="box">
                                                <img src={`/img/${getSliderImages[0].name}`} alt=""/>
                                                <h3 className="position">Image #1</h3>
                                                <button onClick={() => enableEditModeSlider(["test"])} className="btn">Modifier</button>
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
                                                <button onClick={() => enableEditModeSlider(["test"])} className="btn">Modifier</button>
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
                                                <button onClick={() => enableEditModeSlider(["test"])} className="btn">Modifier</button>
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
                                                <Link to="/" className="btn">Modifier</Link>
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
                                                <Link to="/" className="btn">Modifier</Link>
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
                                                <Link to="/" className="btn">Modifier</Link>
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
                                                <Link to="/" className="btn">Modifier</Link>
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
                                                <Link to="/" className="btn">Modifier</Link>
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
                                                <Link to="/" className="btn">Modifier</Link>
                                            </div>
                                        )}
                                    </>
                                :
                                <></>
                            }
                        </div>
                    </div>
                    {
                        (getEditModeSlider)
                        ?
                            <>
                                <div className="editMode">
                                    <form method="post" encType="multipart/form-data">
                                        <h1 className="editTitle">Modifier l'élément sélectionné</h1>
                                        <div>
                                            <label htmlFor="selectImage">Sélectionner parmis les images déjà existantes:</label>
                                            <select name="selectImage" id="selectImage">
                                                <option key="defaultValue" defaultValue=""></option>
                                                {getEditModeData && getEditModeData.map((image) => (
                                                    <option key={"editSliderImage" + image.id} value={image.name}>{image.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button type="submit" className="form-btn-success">Modifier</button>
                                        <button type="reset" onClick={disableEditModeSlider} className="form-btn-error">Annuler</button>
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