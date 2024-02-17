import Slider from "../../components/Slider/Slider";
import TopCategories from "./TopCategories";
import TopProduits from "./TopProduits";
import { testAPI } from '../../services/api';

const HomePage = () => {

    let data = {};
    
    testAPI(data).then(response => {
        if (response.success === true)
        {
            console.log("success");
        }
        else
        {
            console.log("error");
        }
    });

    return(
        <>
            <Slider/>
            <section className="homePage">
                <TopCategories/>
                <TopProduits/>
            </section>
        </>
    );
};

export default HomePage