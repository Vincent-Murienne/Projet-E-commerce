import {useState, useEffect} from 'react';
import {TextField, Checkbox, Text, ActionButton, Form} from '@adobe/react-spectrum';
import Delete from '@spectrum-icons/workflow/Delete';
import { Data } from '../../services/api';
import Checkmark from '@spectrum-icons/workflow/Checkmark';
import { ToastQueue } from "@react-spectrum/toast";
import {Cell, Column, Row, TableView, TableBody, TableHeader} from '@adobe/react-spectrum'
import {Grid} from '@adobe/react-spectrum'
import PropTypes from 'prop-types'; // Importer PropTypes

const SearchPage = ({ onSearch }) => {
    SearchPage.propTypes = {
        onSearch: PropTypes.func.isRequired, // Assurez-vous que onSearch est une fonction et qu'elle est requise
    };

    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [materials, setMaterials] = useState([]);
    const [categories, setCategories] = useState([]);
    const [enStock, setEnStock] = useState(false);

    const handleMinPriceChange = (value) => {
        setMinPrice(value);
    };

    const handleMaxPriceChange = (value) => {
        setMaxPrice(value);
    };

    const handleEnStockChange = (value) => {
        setEnStock(value);
    };

    const handleSearch = () => {
        const searchData = {
            prix_min: minPrice,
            prix_max: maxPrice,
            materiaux: materials.map(material => material.id),
            categories: categories.map(category => category.id),
            en_stock: enStock ? 1 : 0
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
                setCategories(response.data);
            } else {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
        Data("panelAdmin", "getAllFromTable", dataMaterials).then(response => {
            if (response.success === true) {
                setMaterials(response.data);
            } else {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
    }, []); // Pass an empty array as dependency to useEffect to execute it once after initial render

    return (
        <>
            <Form validationBehavior="native">
                <Grid
                    areas={[
                        'prixMin prixMax',
                        'enStock enStock',
                        'matérials matérials',
                        'catégories catégories',
                        'appliquer réinitialiser',
                        'vide vide'
                    ]}
                    columns={['2fr','2fr']}
                    rows={['size-700', 'size-400', 'auto', 'auto', 'size-1000', 'size-500']}
                    rowGap="size-300">

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
                        justifySelf={'center'} 
                        isSelected={enStock}
                        onChange={handleEnStockChange}
                        gridArea='enStock'>En stock</Checkbox>
                    <TableView
                        aria-label="Example table with static contents"
                        selectionMode="multiple"
                        height={200}
                        position={'relative'}
                        gridArea='matérials'
                        >
                        <TableHeader>
                            <Column>Matériaux</Column>
                        </TableHeader>
                        <TableBody>
                            {materials.map((material) => (
                                <Row key={material.id}>
                                    <Cell>{material.name}</Cell>
                                </Row>
                            ))}
                        </TableBody>
                    </TableView>
                    <TableView
                        selectionMode="multiple"
                        height={200}
                        position={'relative'}
                        gridArea='catégories'
                        >
                        <TableHeader>
                            <Column>Catégories</Column>
                        </TableHeader>
                        <TableBody>
                            {categories.map((category) => (
                                <Row key={category.id}>
                                    <Cell>{category.name}</Cell>
                                </Row>
                            ))}
                        </TableBody>
                    </TableView>
                    <ActionButton onClick={handleSearch} type="submit" gridArea='appliquer' width={'size-2000'} justifySelf={'center'} > 
                        <Checkmark />
                        <Text>Appliquer</Text>
                    </ActionButton>
                    <ActionButton type="reset" gridArea='réinitialiser' width={'size-2000'} justifySelf={'center'}> 
                        <Delete />
                        <Text>Réinitialiser</Text>
                    </ActionButton>
                </Grid>
            </Form>
        </>
    );
}

export default SearchPage;
