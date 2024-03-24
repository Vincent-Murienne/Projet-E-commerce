import { Link, useParams } from "react-router-dom"; 
import { Data } from '../../services/api';
import { useEffect, useState } from "react";
import Slider from "../../components/Slider/Slider";


const CategorieList = () => {
    // const { categoryId } = useParams();

    const [categories, setCategories] = useState([]);
  
      useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Data("category", "getAllCategories", { table: "categories" });
                if (response.success === true) {
                    console.log(response);
                    setCategories(response.data);
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
        
        <section className="categoriePage"> 
            <Slider/>
            <section className="top-categories">
            <h1 className="heading">Découvrez la gamme complète de nos catégories de produits</h1>
                <div className="box-container">
                    {categories.map(category => (
                        <div key={category.category_id} className="box">
                            <img src={`/img/${category.image_name}`} alt=""/>
                            <h3>{category.category_name}</h3>
                            <Link to={`/categories/${category.category_id}`} className="btn">Voir plus</Link>
                        </div>
                    ))}
                </div>
            </section>
        </section>
    );
};

export default CategorieList;