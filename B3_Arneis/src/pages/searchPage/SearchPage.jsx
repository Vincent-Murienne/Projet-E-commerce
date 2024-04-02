import {useState} from 'react'
import {TextField, Flex, CheckboxGroup, Checkbox, Text, ActionButton } from '@adobe/react-spectrum';
import Delete from '@spectrum-icons/workflow/Delete';
import Checkmark from '@spectrum-icons/workflow/Checkmark';

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
            <Flex justifyContent="center" direction="row" gap="size-300" wrap>
                <TextField 
                    label="Titre" 
                    placeholder='Titre'
                    validate={(value) => {
                        if (value === '') {
                            return 'Ce champ est obligatoire';
                        }
                    }}
                    isRequired necessityIndicator="icon" 
                />
                <TextField 
                    label="Description" 
                    placeholder='Description'
                    validate={(value) => {
                        if (value === '') {
                            return 'Ce champ est obligatoire';
                        }
                    }}
                    isRequired necessityIndicator="icon" 
                />
                <TextField 
                    label="Prix min" 
                    maxLength={5}
                    onChange={handleMinPriceChange}
                    placeholder='Prix min€'
                    type='number'
                    onClick={() => console.log('click')}
                    validate={(value) => {
                        if (value !== '' && value > maxPrice) {
                            return 'Le prix minimum doit être inférieur au prix maximum';
                        }
                        else if (value === '') {
                            return 'Ce champ est obligatoire';
                        }
                    }}
                    isRequired necessityIndicator="icon" 
                />
                <TextField 
                    label="Prix max" 
                    maxLength={5}
                    onChange={handleMaxPriceChange}
                    placeholder='Prix max€'
                    type='number'
                    validate={(value) => {
                        console.log(value);
                        if (value !== '' && value < minPrice) {
                            return 'Le prix maximum doit être supérieur au prix minimum';
                        }
                        else if (value === '') {
                            return 'Ce champ est obligatoire';
                        }
                    }}
                    isRequired necessityIndicator="icon" 
                />
                <CheckboxGroup 
                    label="Matériaux" 
                    name="matériaux"
                    onChange={setCheckedMaterials}
                    isInvalid={!isMaterialsValid}
                    errorMessage={isMaterialsValid ? '' : 'Sélectionnez au moins un matériau'}
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
                    errorMessage={isCategoriesValid ? '' : 'Sélectionnez au moins une catégorie'}
                >
                    <Checkbox value="table">Table</Checkbox>
                    <Checkbox value="lit">Lit</Checkbox>
                    <Checkbox value="fauteuil">Fauteuil</Checkbox>
                </CheckboxGroup>

                <ActionButton> 
                    <Checkmark />
                    <Text>Appliquer</Text>
                </ActionButton>
                <ActionButton> 
                    <Delete />
                    <Text>Réinitialiser</Text>
                </ActionButton>
            </Flex>
        </>
    );
}

export default SearchPage;
