import {useState, useEffect} from 'react';
import {TextField, Checkbox, Text, ActionButton, Form} from '@adobe/react-spectrum';
import Delete from '@spectrum-icons/workflow/Delete';
import { Data } from '../../services/api';
import Checkmark from '@spectrum-icons/workflow/Checkmark';
import { ToastQueue } from "@react-spectrum/toast";
import {Cell, Column, Row, TableView, TableBody, TableHeader} from '@adobe/react-spectrum'
import {Grid} from '@adobe/react-spectrum'
import PropTypes from 'prop-types'; // Importer PropTypes
import { useLocation } from 'react-router-dom';

const SearchPage = ({ searchQuery, onSearch }) => {
    SearchPage.propTypes = {
        onSearch: PropTypes.func.isRequired, // Assurez-vous que onSearch est une fonction et qu'elle est requise
    };

    // Récupération des informations de la barre de recherche
    // const location = useLocation();
    // const searchParams = new URLSearchParams(location.search);
    // let searchQuery = searchParams.get('search');

    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [materials, setMaterials] = useState([]);
    const [selectedMaterials, setSelectedMaterials] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [enStock, setEnStock] = useState(false);
    const [recherche, setRecherche] = useState(searchQuery);

    const handleMinPriceChange = (value) => {
        setMinPrice(value);
    };

    const handleMaxPriceChange = (value) => {
        setMaxPrice(value);
    };

    const handleEnStockChange = (value) => {
        setEnStock(value);
    };
    
    const handleMaterialsChange = (indexSelected) => {
        let indexes = [];
        for(let index of indexSelected) {
            indexes.push(parseInt(materials.at(index-1).id));
        };

        setSelectedMaterials(indexes);
    };

    const handleCategoriesChange = (indexSelected) => {
        let indexes = [];
        for(let index of indexSelected) {
            indexes.push(parseInt(categories.at(index-1).id));
        };

        setSelectedCategories(indexes);
    };

    const handleFilterSearch = () => {
        const searchData = {
            recherche: recherche !== "" ? recherche : null,
            prix_min: minPrice !== "" ? parseFloat(minPrice) : null,
            prix_max: maxPrice !== "" ? parseFloat(maxPrice) : null,
            materiaux: selectedMaterials,
            categories: selectedCategories,
            en_stock: enStock
        };

        onSearch(searchData);
      };

    let dataCategories = {
        "table": "categories"
    };

    let dataMaterials = {
        "table": "materials_list"
    };

    useEffect(() => {
        Data("panelAdmin", "getAllFromTable", dataCategories).then(response => {
          if (response.success === true) {
            setCategories(response.data.map(category => ({ ...category, isSelected: false })));
          } else {
            ToastQueue.negative(response.error, {timeout: 5000});
          }
        });
      
        Data("panelAdmin", "getAllFromTable", dataMaterials).then(response => {
          if (response.success === true) {
            setMaterials(response.data.map(material => ({ ...material, isSelected: false })));
          } else {
            ToastQueue.negative(response.error, {timeout: 5000});
          }
        });
      }, []); // Pass an empty array as dependency to useEffect to execute it once after initial render

    return (
        <>
            <Form validationBehavior="native">
                <Grid
                    aria-label="Grid"
                    areas={[
                        'recherche recherche',
                        'prixMin prixMax',
                        'enStock enStock',
                        'matérials matérials',
                        'catégories catégories',
                        'appliquer réinitialiser',
                        'vide vide'
                    ]}
                    columns={['2fr','2fr']}
                    rows={['auto', 'size-700', 'size-400', 'auto', 'auto', 'size-1000', 'size-500']}
                    rowGap="size-300">

                    <TextField
                        label="Recherche"
                        value={recherche}
                        onChange={setRecherche}
                        type='text'
                        gridArea="recherche"
                        justifySelf={'center'}
                        width={'size-4000'}
                    />
                    <TextField
                        label="Prix min€" 
                        maxLength={5}
                        onChange={handleMinPriceChange}
                        type='number'
                        gridArea="prixMin"
                        justifySelf={'center'}
                        width={'size-2000'}
                    />
                    <TextField 
                        label="Prix max€" 
                        maxLength={5}
                        onChange={handleMaxPriceChange}
                        type='number'
                        gridArea="prixMax"
                        justifySelf={'center'}
                        width={'size-2000'}
                    />
                    <Checkbox
                        aria-label="En stock"
                        justifySelf={'center'} 
                        isSelected={enStock}
                        onChange={handleEnStockChange}
                        gridArea='enStock'>En stock</Checkbox>
                    <TableView
                        aria-label="Example table with static contents"
                        selectionMode="multiple"
                        onSelectionChange={handleMaterialsChange}
                        height={200}
                        position={'relative'}
                        gridArea='matérials'
                        >
                        <TableHeader>
                            <Column>Matériaux</Column>
                        </TableHeader>
                        <TableBody>
                            {materials.map((material) => (
                                <Row key={material.id} aria-label={material.name}>
                                    <Cell aria-label={material.name}>{material.name}</Cell>
                                </Row>
                            ))}
                        </TableBody>
                    </TableView>
                    <TableView
                        aria-label="Tableau de catégories"
                        selectionMode="multiple"
                        onSelectionChange={handleCategoriesChange}
                        height={200}
                        position={"relative"}
                        gridArea="catégories"
                        >
                        <TableHeader>
                            <Column aria-label="Catégories">Catégories</Column>
                        </TableHeader>
                        <TableBody>
                            {categories.map((category) => (
                                <Row key={category.id} aria-label={category.name}>
                                    <Cell aria-label={category.name}>{category.name}</Cell>
                                </Row>
                            ))}
                        </TableBody>
                    </TableView>
                    <ActionButton onPress={handleFilterSearch} gridArea="appliquer" width={"size-2000"} justifySelf={"center"}  aria-label="Appliquer"> 
                        <Checkmark />
                        <Text>Appliquer</Text>
                    </ActionButton>
                    <ActionButton type="reset" gridArea="réinitialiser" width={"size-2000"} justifySelf={"center"} aria-label="Réinitialiser"> 
                        <Delete />
                        <Text>Réinitialiser</Text>
                    </ActionButton>
                </Grid>
            </Form>
        </>
    );
}

export default SearchPage;
