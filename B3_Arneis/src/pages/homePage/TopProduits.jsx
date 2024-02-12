import { Link } from "react-router-dom";

const TopProduits = () => {
    return(
        <>
            <section class="top-produits">

                <h1 class="heading">Les <span>Highlanders</span> du moment</h1>

                <div class="box-container">

                    <div class="box">
                        <img src="/img/slider_1.jpg" alt=""/>
                        <h3>Produit #1</h3>
                        <Link to="/" class="btn">Voir plus</Link>
                    </div>
                    <div class="box">
                        <img src="/img/slider_2.jpg" alt=""/>
                        <h3>Produit #2</h3>
                        <Link to="/" class="btn">Voir plus</Link>
                    </div>
                    <div class="box">
                        <img src="/img/slider_3.jpg" alt=""/>
                        <h3>Produit #3</h3>
                        <Link to="/" class="btn">Voir plus</Link>
                    </div>
                </div>
            </section>
        </>
    );
};

export default TopProduits;