import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import {Flex, Text, ActionButton, ComboBox, Item} from '@adobe/react-spectrum';
import SearchPage from '../searchPage/SearchPage';
import Close from '@spectrum-icons/workflow/Close';
import Filter from '@spectrum-icons/workflow/Filter';

const ProductSearchPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');
  const showResults = searchQuery !== null; // Checks if searchQuery is defined

  const [showSearchPage, setShowSearchPage] = useState(false);
  const [filtering, setFiltering] = useState(false);

  const handleShowSearchPage = () => {
    setShowSearchPage(true);
    setFiltering(true);
  };

  const handleCloseSearchPage = () => {
    setShowSearchPage(false);
    setFiltering(false);
  };

  return (
    <>
      {/* ProductPage */}
      <div className={`product-page ${showSearchPage ? 'inactive' : ''}`}>
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
            <ActionButton onClick={handleShowSearchPage} isDisabled={filtering}> 
                <Filter />
                <Text>Filtrer</Text>
            </ActionButton>
            <ComboBox placeholder='Trier par:' isDisabled={filtering}>
                <Item key="prixAsc">prix (asc)</Item>
                <Item key="prixDesc">prix (desc)</Item>
                <Item key="AjoutAsc">Date d'ajout (asc)</Item>
                <Item key="AjoutDesc">Date d'ajout (desc)</Item>
                <Item key="QuantitéAsc">Quantité en stock (asc)</Item>
                <Item key="QuantitéDesc">Quantité en stock (desc)</Item>
            </ComboBox>
        </Flex>
      </div>
      
      {/* SearchPage */}
      {showSearchPage && (
        <div className="rectangle">
            <Flex justifyContent="center" marginTop="5%"direction="row" gap="size-300" wrap>
                <h1>Tous les filtres</h1>
                <ActionButton onClick={handleCloseSearchPage}> 
                    <Close />
                    <Text>Fermer</Text>
                </ActionButton>
                <SearchPage />
            </Flex>
        </div>
      )}
    </>
  );
}

export default ProductSearchPage;