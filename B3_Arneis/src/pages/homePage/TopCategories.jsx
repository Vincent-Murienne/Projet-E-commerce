import { Link } from "react-router-dom";

const TopCategories = () => {
    return(
        <>
            <section className="top-categories">

                <h1 className="heading">Venant des hautes terres d'écosse nos meubles sont <span>immortels</span> </h1>

                <div className="box-container">

                    <div className="box">
                        <img src="/img/slider_1.jpg" alt=""/>
                        <h3>Catégorie #1</h3>
                        <Link to="/" className="btn">Voir plus</Link>
                    </div>
                    <div className="box">
                        <img src="/img/slider_2.jpg" alt=""/>
                        <h3>Catégorie #2</h3>
                        <Link to="/" className="btn">Voir plus</Link>
                    </div>
                    <div className="box">
                        <img src="/img/slider_3.jpg" alt=""/>
                        <h3>Catégorie #3</h3>
                        <Link to="/" className="btn">Voir plus</Link>
                    </div>
                </div>
            </section>
        </>
    );
};

export default TopCategories;