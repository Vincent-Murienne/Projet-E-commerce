import { useState } from "react";
import { Link } from "react-router-dom";


const HomePageManager = () => {
    const [getEditMode, setEditMode] = useState(false);
    const [getEditModeData, setEditModeData] = useState([]);

    const enableEditMode = () => {
        setEditMode(true);
    };

    const disableEditMode = () => {
        setEditMode(false);
    }

    return(
        <>
            <section className="homePage">
                <div className="homePageManager">
                    <div className="sliderManager">
                        <h1>Slider manager</h1>
                        <div className="box-container">
                            <div className="box">
                                <img src="/img/1-1-chaise-design-blanc-et-bois-clair-.jpg" alt="" />
                                <h3 className="position">Image #1</h3>
                                <button onClick={enableEditMode} className="btn">Modifier</button>
                            </div>
                            <div className="box">
                                <img src="/img/1-1-chaise-design-blanc-et-bois-clair-.jpg" alt="" />
                                <h3 className="position">Image #2</h3>
                                <Link to="/" className="btn">Modifier</Link>
                            </div>
                            <div className="box">
                                <img src="/img/1-1-chaise-design-blanc-et-bois-clair-.jpg" alt="" />
                                <h3 className="position">Image #3</h3>
                                <Link to="/" className="btn">Modifier</Link>
                            </div>
                        </div>
                    </div>
                    <div className="topCategoriesManager">
                        <h1>Top Catégories manager</h1>
                        <div className="box-container">
                            <div className="box">
                                <img src="/img/1-1-chaise-design-blanc-et-bois-clair-.jpg" alt="" />
                                <h3 className="position">Catégorie #1</h3>
                                <Link to="/" className="btn">Modifier</Link>
                            </div>
                            <div className="box">
                                <img src="/img/1-1-chaise-design-blanc-et-bois-clair-.jpg" alt="" />
                                <h3 className="position">Catégorie #2</h3>
                                <Link to="/" className="btn">Modifier</Link>
                            </div>
                            <div className="box">
                                <img src="/img/1-1-chaise-design-blanc-et-bois-clair-.jpg" alt="" />
                                <h3 className="position">Catégorie #3</h3>
                                <Link to="/" className="btn">Modifier</Link>
                            </div>
                        </div>
                    </div>
                    <div className="topProductsManager">
                        <h1>Top Produits manager</h1>
                        <div className="box-container">
                        <div className="box">
                                <img src="/img/1-1-chaise-design-blanc-et-bois-clair-.jpg" alt="" />
                                <h3 className="position">Produit #1</h3>
                                <Link to="/" className="btn">Modifier</Link>
                            </div>
                            <div className="box">
                                <img src="/img/1-1-chaise-design-blanc-et-bois-clair-.jpg" alt="" />
                                <h3 className="position">Produit #2</h3>
                                <Link to="/" className="btn">Modifier</Link>
                            </div>
                            <div className="box">
                                <img src="/img/1-1-chaise-design-blanc-et-bois-clair-.jpg" alt="" />
                                <h3 className="position">Produit #3</h3>
                                <Link to="/" className="btn">Modifier</Link>
                            </div>
                        </div>
                    </div>
                    {
                        (getEditMode)
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
                                            <label htmlFor="importImage">Importer une nouvelle image:</label>
                                            <input type="file" name="importImage" id="importImage"/>
                                        </div>
                                        <div>
                                            <label htmlFor="selectImage">Sélectionner parmis les images déjà existantes:</label>
                                            <select name="selectImage" id="selectImage">
                                                <option selected value=""></option>
                                                <option value="image 1">Image 1</option>
                                                <option value="image 2">Image 2</option>
                                                <option value="image 3">Image 3</option>
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