import { Link, useParams } from "react-router-dom"; // Import de useParams pour récupérer les paramètres d'URL
import { Data } from '../../services/api';
import { useEffect, useState } from "react";

const CategorieList = () => {
    const { categoryId } = useParams(); // Récupération de l'ID de la catégorie depuis les paramètres d'URL

    const [getTopProducts, setTopProducts] = useState([]);
    const [getTopCategories, setTopCategories] = useState([]);
  
      useEffect(() => {
        // Utilisation de l'ID de la catégorie pour récupérer les produits dynamiquement
        const fetchData = async () => {
            try {
                const response = await Data("category", "getAllCategory", { table: "categories" });
                if (response.success === true) {
                    console.log(response);
                    setTopCategories(response.data);
                } else {
                    console.log(response.error);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
  
        fetchData();
    }, []);
}

export default CategorieList;