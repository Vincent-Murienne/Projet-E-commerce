import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {Flex, Text, ActionButton, ComboBox, Item} from '@adobe/react-spectrum';
import SearchPage from '../searchPage/SearchPage';
import Close from '@spectrum-icons/workflow/Close';
import Filter from '@spectrum-icons/workflow/Filter';
import { Data } from '../../services/api';
import { ToastQueue } from "@react-spectrum/toast";
import {Grid} from '@adobe/react-spectrum'

const ProductSearchPage = () => {
  // Récupération des informations de la barre de recherche
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');
  const showResults = searchQuery !== null; // Checks if searchQuery is defined

  const [showSearchPage, setShowSearchPage] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const [produits, setProduits] = useState([]);

  const handleShowSearchPage = () => {
    setShowSearchPage(true);
    setFiltering(true);
  };

  const handleCloseSearchPage = () => {
    setShowSearchPage(false);
    setFiltering(false);
  };

  useEffect(() => {
    Data("searchProduct", "getProductByPriority", { "name": searchQuery, "table": "products" }).then(response => {
      if (response.success === true) {
        setProduits(response.data);
      } else {
        ToastQueue.negative(response.error, {timeout: 5000});
      }
    });
  }, []);

  const handleSearch = (searchData) => {
    handleCloseSearchPage();

    Data("searchProduct", "getProductByFilter", searchData).then(response => {
      if (response.success === true) {
        setProduits(response.data);
      } else {
        ToastQueue.negative(response.error, {timeout: 5000});
      }
    });
  }


  return (
    <>
      {filtering && <div className="overlay"></div>}
      <section className="categoriePage">
        <div className={`product-page ${filtering ? 'inactive' : ''}`}>
          {showResults ? (
              <>
                  <h1>Résultat</h1>
                  <h2>Liste des produits : "{searchQuery}"</h2>
              </>
          ) : (
              <>
                  <h1>Liste des produits</h1>
              </>
          )}
          <Flex justifyContent="center" direction="row" gap="size-300" wrap>
            <ActionButton onPress={handleShowSearchPage} isDisabled={filtering}> 
              <Filter />
              <Text>Filtrer</Text>
            </ActionButton>
            <ComboBox description="Trier par:" aria-label="Trier par:" isDisabled={filtering}>
              <Item key="prixAsc">prix (asc)</Item>
              <Item key="prixDesc">prix (desc)</Item>
              <Item key="AjoutAsc">Date d'ajout (asc)</Item>
              <Item key="AjoutDesc">Date d'ajout (desc)</Item>
              <Item key="QuantitéAsc">Quantité en stock (asc)</Item>
              <Item key="QuantitéDesc">Quantité en stock (desc)</Item>
            </ComboBox>
          </Flex>
          {produits.length > 0 ? (
            <div className="box-container">
              {produits.map((product, index) => (
                <div key={product.id || index} className="box">
                  <img src={`/img/${product.image_name}`} alt=""/>
                  <div className="card-title">
                    <h4>{product.produits_nom}</h4>
                    <h4>{product.price}€</h4>
                  </div>
                  <Link to={`/product/${product.id}`} className="btn">Voir plus</Link>  
                </div>
              ))}
            </div>
          ) : (
            <div>Aucun produit trouvé.</div>
          )}
        </div>
  
        {showSearchPage && (
          <div className="rectangle">
            <Grid
              areas={[
                'btnClose btnClose'
              ]}
              columns={['2fr', '2fr']}
              rows={['size-1000']}
              rowGap={'size-500'}>
              <ActionButton onPress={handleCloseSearchPage} gridArea="btnClose" width={'size-1500'} marginTop={'size-400'} justifySelf={'center'}>
                <Close/>
                <Text>Fermer</Text>
              </ActionButton>
            </Grid>
            <SearchPage onSearch={handleSearch}/>
          </div>
        )}
      </section>
    </>
  );
}

export default ProductSearchPage;