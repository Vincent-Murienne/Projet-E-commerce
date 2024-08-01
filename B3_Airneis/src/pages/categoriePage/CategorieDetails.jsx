import { Link, useParams } from "react-router-dom";
import { Data } from '../../services/api';
import { useEffect, useState } from "react";
import { ToastQueue } from "@react-spectrum/toast";
import { useTranslation } from 'react-i18next';

const CategorieDetails = () => {
    const { t } = useTranslation();
    const { categoryId } = useParams(); // Retrieving the category ID from URL parameters

    // Setting use states
    const [getTopProducts, setTopProducts] = useState([]);
    const [getCategoryImage, setCategoryImage] = useState([]);
    const [getCategoryName, setCategoryName] = useState("");


    useEffect(() => {
        // Using the category ID to dynamically fetch products
        const fetchData = async () => {
            try {
                const response = await Data("category", "getCategory", { table: "products", id: categoryId });
                if (response.success === true) {
                    setTopProducts(response.data);
                    setCategoryImage(response.data[0].category_image_name); 
                    setCategoryName(response.data[0].category_name);
                } else {
                    ToastQueue.negative(response.error, {timeout: 5000});
                }
            } catch (error) {
                ToastQueue.negative("Une erreur est survenue lors de la récupération des données de la catégorie", {timeout: 5000});
            }
        };

        fetchData();
    }, [categoryId]);

    return(
        <>  
            <section className="categoriePage">
                <img src={`/img/${getCategoryImage}`} alt="Image de catégorie" className="categoriePage-image"/>
                <div className="description-centre">
                    <h1>{t('categorieTitle')} {getCategoryName}:</h1>
                    <p>{t('categorieDescription1')}</p>
                    <p>{t('categorieDescription2')} {getCategoryName.toLowerCase()} !</p>
                </div>
                <section className="top-produits">
                    <h1 className="heading">{t('highlightedCategorieTitle')} {getCategoryName.toLowerCase()} :</h1>
                    <div className="box-container">
                        {getTopProducts && getTopProducts.map((product) => (
                            <div key={product.id} className="box" >
                                <img src={`/img/${product.product_image_name}`} alt=""/>
                                <div className="card-title">
                                    <h4>{product.name}</h4>
                                    <h4>{product.price}€</h4>
                                </div>
                                <Link to={`/product/${product.id}`} className="btn">{t('seeMore')}</Link>                            </div>
                        ))}
                    </div>
                </section>
            </section>
        </>
    );
};

export default CategorieDetails;