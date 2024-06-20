import { Link } from "react-router-dom";
import { Data } from '../../services/api';
import { useEffect, useState } from "react";
import { ToastQueue } from "@react-spectrum/toast";
import { useTranslation } from 'react-i18next';

const TopProduits = () => {
    const { t } = useTranslation();
    const [getTopProducts, setTopProducts] = useState([]);

    let data = {
        "table": "products"
    };

    useEffect(() => {
        Data("panelAdmin", "getTop", data).then(response => {
            if (response.success === true)
            {
                setTopProducts(response.data);
            }
            else
            {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
    }, []);

    return(
        <>
            <section className="top-produits">

                <h1 className="heading">{t('titleTopProduits')}</h1>

                <div className="box-container">
                    {getTopProducts && getTopProducts.map((product) => (
                        <div key={product.product_id} className="box">
                            <img src={`/img/${product.image_name}`} alt=""/>
                            <h3>{product.product_name}</h3>
                            <Link to={`/product/${product.product_id}`} className="btn">{t('seeMore')}</Link>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};

export default TopProduits;