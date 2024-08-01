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
  // Get URL informations
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Setting use states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') !== null ? searchParams.get('search') : "");
  const [showSearchPage, setShowSearchPage] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const [produits, setProduits] = useState([]);
  const [prixMin, setPrixMin] = useState(null);
  const [prixMax, setPrixMax] = useState(null);
  const [materiaux, setMateriaux] = useState([]);
  const [categories, setCategories] = useState([]);
  const [enStock, setEnStock] = useState(false);
  const [orderBy, setOrderBy] = useState("sansTri");

  // Handling form changes
  const handleShowSearchPage = () => {
    setShowSearchPage(true);
    setFiltering(true);
  };

  const handleCloseSearchPage = () => {
    setShowSearchPage(false);
    setFiltering(false);
  };

  useEffect(() => {
    const searchData = {
      recherche: searchQuery !== "" ? searchQuery : null,
      prix_min: prixMin,
      prix_max: prixMax,
      materiaux: materiaux,
      categories: categories,
      en_stock: enStock
    };

    handleSearch(searchData);
  }, []);

  useEffect(() => {
    const searchData = {
      recherche: searchQuery !== "" ? searchQuery : null,
      prix_min: prixMin,
      prix_max: prixMax,
      materiaux: materiaux,
      categories: categories,
      en_stock: enStock
    };

    handleSearch(searchData);
  }, [orderBy]);

  // Form submission
  const handleSearch = (searchData) => {
    handleCloseSearchPage();

    if(searchData.recherche !== null) {
      setSearchQuery(searchData.recherche);
    } else {
      setSearchQuery("");
    }

    setPrixMin(searchData.prix_min);
    setPrixMax(searchData.prix_max);
    setMateriaux(searchData.materiaux);
    setCategories(searchData.categories);
    setEnStock(searchData.en_stock);

    if(orderBy !== "sansTri") {
      searchData.orderBy = orderBy;
    } else {
      searchData.orderBy = null;
    }

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
          <h1>Résultat</h1>
          <h2>Liste des produits : "{searchQuery}"</h2>
          <Flex justifyContent="center" direction="row" gap="size-300" wrap>
            <ActionButton onPress={handleShowSearchPage} isDisabled={filtering}> 
              <Filter />
              <Text>Filtrer</Text>
            </ActionButton>
            <ComboBox description="Trier par:" aria-label="Trier par:" isDisabled={filtering} onSelectionChange={setOrderBy} selectedKey={orderBy}>
              <Item key="sansTri">Aucun tri</Item>
              <Item key="nomAsc">nom (asc)</Item>
              <Item key="nomDesc">nom (desc)</Item>
              <Item key="prixAsc">prix (asc)</Item>
              <Item key="prixDesc">prix (desc)</Item>
              <Item key="QuantiteAsc">Quantité en stock (asc)</Item>
              <Item key="QuantiteDesc">Quantité en stock (desc)</Item>
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
                  <Link to={`/product/${product.produits_id}`} className="btn">Voir plus</Link>  
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
            <SearchPage searchQuery={searchQuery} prixMinInput={prixMin} prixMaxInput={prixMax} materiauxInput={materiaux} categoriesInput={categories} enStockInput={enStock} onSearch={handleSearch}/>
          </div>
        )}
      </section>
    </>
  );
}

export default ProductSearchPage;