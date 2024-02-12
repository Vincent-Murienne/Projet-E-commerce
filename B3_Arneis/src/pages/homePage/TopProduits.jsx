import { Link } from "react-router-dom";

const TopProduits = () => {
    return(
        <>
            <section className="top-produits">

                <h1 className="heading">Les <span>Highlanders</span> du moment</h1>

                <div className="box-container">

                    <div className="box">
                        <img src="/img/slider_1.jpg" alt=""/>
                        <h3>Produit #1</h3>
                        <Link to="/" className="btn">Voir plus</Link>
                    </div>
                    <div className="box">
                        <img src="/img/slider_2.jpg" alt=""/>
                        <h3>Produit #2</h3>
                        <Link to="/" className="btn">Voir plus</Link>
                    </div>
                    <div className="box">
                        <img src="/img/slider_3.jpg" alt=""/>
                        <h3>Produit #3</h3>
                        <Link to="/" className="btn">Voir plus</Link>
                    </div>
                </div>
            </section>
        </>
    );
};

export default TopProduits;