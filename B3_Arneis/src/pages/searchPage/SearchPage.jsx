import {useState} from 'react'
import {TextField, Flex} from '@adobe/react-spectrum'
import {CheckboxGroup, Checkbox} from '@adobe/react-spectrum'

const SearchPage = () => {
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const handleMinPriceChange = (value) => {
        setMinPrice(value);
    };

    const handleMaxPriceChange = (value) => {
        setMaxPrice(value);
    };

    let [checkedMaterials, setCheckedMaterials] = useState([]);
    let [checkedCategories, setCheckedCategories] = useState([]);
    let isMaterialsValid = checkedMaterials.length >= 1;
    let isCategoriesValid = checkedCategories.length >= 1;
    

    return (
        <>
            <Flex gap="size-150" wrap>
                <TextField 
                    label="Prix min" 
                    maxLength={5}
                    onChange={handleMinPriceChange}
                    validate={(value) => {
                        if (value && isNaN(value)) {
                            return 'Veuillez saisir un nombre';
                        }
                        else if (value !== '' && value > maxPrice) {
                            return 'Le prix minimum doit être inférieur au prix maximum';
                        }
                        else if (value === '') {
                            return 'Ce champ est obligatoire';
                        }
                    }}
                    isRequired necessityIndicator="icon" />
                <TextField 
                    label="Prix max" 
                    maxLength={5}
                    onChange={handleMaxPriceChange}
                    validate={(value) => {
                        console.log(value);
                        if (value && isNaN(value)) {
                            return 'Veuillez saisir un nombre';
                        }
                        else if (value !== '' && value < minPrice) {
                            return 'Le prix maximum doit être supérieur au prix minimum';
                        }
                        else if (value === '') {
                            return 'Ce champ est obligatoire';
                        }
                    }}
                    isRequired necessityIndicator="icon" />
            </Flex>
            <CheckboxGroup 
                label="Matériaux" 
                name="matériaux"
                onChange={setCheckedMaterials}
                isInvalid={!isMaterialsValid}
                errorMessage={isMaterialsValid ? '' : 'Veuillez sélectionner au moins un matériau'}
            >
                    <Checkbox value="bois">Bois</Checkbox>
                    <Checkbox value="acier">Acier</Checkbox>
                    <Checkbox value="plastique">Plastique</Checkbox>
            </CheckboxGroup>
            
            <CheckboxGroup 
                label="Catégories" 
                name="catégories"
                onChange={setCheckedCategories}
                isInvalid={!isCategoriesValid}
                errorMessage={isCategoriesValid ? '' : 'Veuillez sélectionner au moins une catégorie'}>
                <Checkbox value="table">Table</Checkbox>
                <Checkbox value="lit">Lit</Checkbox>
                <Checkbox value="fauteuil">Fauteuil</Checkbox>
            </CheckboxGroup>
        </>
    );
}

export default SearchPage;
