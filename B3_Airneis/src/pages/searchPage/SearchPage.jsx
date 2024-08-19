import { useState, useEffect } from 'react';
import { TextField, Checkbox, Text, ActionButton, Form } from '@adobe/react-spectrum';
import Delete from '@spectrum-icons/workflow/Delete';
import { Data } from '../../services/api';
import Checkmark from '@spectrum-icons/workflow/Checkmark';
import { ToastQueue } from "@react-spectrum/toast";
import { Cell, Column, Row, TableView, TableBody, TableHeader } from '@adobe/react-spectrum';
import { Grid } from '@adobe/react-spectrum';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const SearchPage = ({ searchQuery, prixMinInput, prixMaxInput, materiauxInput, categoriesInput, enStockInput, onSearch }) => {
    SearchPage.propTypes = {
        onSearch: PropTypes.func.isRequired, // Check that onSearch is set and is a function
    };

    const { t } = useTranslation();

    // Setting use states
    const [minPrice, setMinPrice] = useState(prixMinInput !== null ? prixMinInput : "");
    const [maxPrice, setMaxPrice] = useState(prixMaxInput !== null ? prixMaxInput : "");
    const [materials, setMaterials] = useState([]);
    const [selectedMaterials, setSelectedMaterials] = useState(materiauxInput);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(categoriesInput);
    const [enStock, setEnStock] = useState(enStockInput);
    const [recherche, setRecherche] = useState(searchQuery);

    // Handling form changes
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

    const resetFilter = () => {
        const searchData = {
            recherche: null,
            prix_min: null,
            prix_max: null,
            materiaux: [],
            categories: [],
            en_stock: false
        };

        onSearch(searchData);
    };

    // Make an API call to get all needed informations
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
            ToastQueue.negative(response.error, { timeout: 5000 });
          }
        });
      
        Data("panelAdmin", "getAllFromTable", dataMaterials).then(response => {
          if (response.success === true) {
            setMaterials(response.data.map(material => ({ ...material, isSelected: false })));
          } else {
            ToastQueue.negative(response.error, { timeout: 5000 });
          }
        });
    }, []);

    return (
        <>
            <Form validationBehavior="native">
                <Grid
                    aria-label={t("grid")}
                    areas={[
                        'recherche recherche',
                        'prixMin prixMax',
                        'enStock enStock',
                        'matérials matérials',
                        'catégories catégories',
                        'appliquer réinitialiser',
                        'vide vide'
                    ]}
                    columns={['2fr', '2fr']}
                    rows={['auto', 'size-700', 'size-400', 'auto', 'auto', 'size-1000', 'size-500']}
                    rowGap="size-300">

                    <TextField
                        label={t("search")}
                        value={recherche}
                        defaultValue={recherche}
                        onChange={setRecherche}
                        type='text'
                        gridArea="recherche"
                        justifySelf={'center'}
                        width={'size-4000'}
                    />
                    <TextField
                        label={t("minPrice")} 
                        maxLength={5}
                        onChange={handleMinPriceChange}
                        defaultValue={minPrice}
                        type='number'
                        gridArea="prixMin"
                        justifySelf={'center'}
                        width={'size-2000'}
                    />
                    <TextField 
                        label={t("maxPrice")} 
                        maxLength={5}
                        onChange={handleMaxPriceChange}
                        defaultValue={maxPrice}
                        type='number'
                        gridArea="prixMax"
                        justifySelf={'center'}
                        width={'size-2000'}
                    />
                    <Checkbox
                        aria-label={t("inStock")}
                        justifySelf={'center'} 
                        isSelected={enStock}
                        onChange={handleEnStockChange}
                        gridArea='enStock'>
                        {t("inStock")}
                    </Checkbox>
                    <TableView
                        aria-label={t("materials")}
                        selectionMode="multiple"
                        defaultSelectedKeys={materiauxInput.map(id => id.toString())}
                        onSelectionChange={handleMaterialsChange}
                        height={200}
                        position={'relative'}
                        gridArea='matérials'>
                        <TableHeader>
                            <Column>{t("materials")}</Column>
                        </TableHeader>
                        <TableBody>
                            {materials && materials.map((material) => (
                                <Row key={material.id} aria-label={material.name}>
                                    <Cell aria-label={material.name}>{material.name}</Cell>
                                </Row>
                            ))}
                        </TableBody>
                    </TableView>
                    <TableView
                        aria-label={t("categories")}
                        selectionMode="multiple"
                        defaultSelectedKeys={categoriesInput.map(id => id.toString())}
                        onSelectionChange={handleCategoriesChange}
                        height={200}
                        position={"relative"}
                        gridArea="catégories">
                        <TableHeader>
                            <Column aria-label={t("categories")}>{t("categories")}</Column>
                        </TableHeader>
                        <TableBody>
                            {categories && categories.map((category) => (
                                <Row key={category.id} aria-label={category.name}>
                                    <Cell aria-label={category.name}>{category.name}</Cell>
                                </Row>
                            ))}
                        </TableBody>
                    </TableView>
                    <ActionButton onPress={handleFilterSearch} gridArea="appliquer" width={"size-2000"} justifySelf={"center"} aria-label={t("apply")}> 
                        <Checkmark />
                        <Text>{t("apply")}</Text>
                    </ActionButton>
                    <ActionButton onPress={resetFilter} gridArea="réinitialiser" width={"size-2000"} justifySelf={"center"} aria-label={t("reset")}> 
                        <Delete />
                        <Text>{t("reset")}</Text>
                    </ActionButton>
                </Grid>
            </Form>
        </>
    );
}

export default SearchPage;
