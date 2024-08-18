import { Link } from "react-router-dom"; 
import { Data } from '../../services/api';
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { ToastQueue } from "@react-spectrum/toast";


const CategorieList = () => {

    const { t } = useTranslation();

    // Setting use states
    const [categories, setCategories] = useState([]);

    // Make an API call to get all the categories
    useEffect(() => {
        Data("category", "getAllCategories", { "table": "categories" }).then(response => {
            if (response.success === true)
            {
                setCategories(response.data);
            }
            else
            {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
    }, []);

    return (       
        <section className="categoriePage"> 
            <section className="top-categories">
            <h1 className="heading">{t('highlightedCategorieTitle')}</h1>
                <div className="box-container">
                    {categories.map(category => (
                        <div key={category.category_id} className="box">
                            <img src={`/img/${category.image_name}`} alt=""/>
                            <h3>{category.category_name}</h3>
                            <Link to={`/categories/${category.category_id}`} className="btn">{t('seeMore')}</Link>

                        </div>
                    ))}
                </div>
            </section>
        </section>
    );
};

export default CategorieList;