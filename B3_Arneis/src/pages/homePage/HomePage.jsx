import Slider from "../../components/Slider/Slider";
import TopCategories from "./TopCategories";
import TopProduits from "./TopProduits";

const HomePage = () => {
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