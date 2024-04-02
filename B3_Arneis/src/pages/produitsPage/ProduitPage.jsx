import { Link } from "react-router-dom";
import { Data } from '../../services/api';
import { useEffect, useState } from "react";

const ProduitPage = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Data("produit", "getProduitDetail");
                if (response.success === true) {
                    setProducts(response.data);
                    console.log(response.data);
                } else {
                    console.log(response.error);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <section className="categoriePage">
                <h1 className="heading">Découvrez ici notre gamme de produits d'intérieur :</h1>
                {products.map(product => (
                    <div key={product.product_id}>
                        <h2>{product.product_name}</h2>
                        <p>Prix: {product.product_order}</p>
                        <p>Stock: {product.image_name}</p>
                    </div>
                ))}
                <Link to="/produits" className="btn">Voir plus</Link>
            </section>
        </>
    );
};

export default ProduitPage;
