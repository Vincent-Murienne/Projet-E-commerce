import {useState} from 'react'
import {TextField, Flex, CheckboxGroup, Checkbox, Text, ActionButton, Form, View } from '@adobe/react-spectrum';
import Delete from '@spectrum-icons/workflow/Delete';
import Checkmark from '@spectrum-icons/workflow/Checkmark';

const SearchPage = () => {
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [validatePressBtn, setValidatePressBtn] = useState(false);

    const handleMinPriceChange = (value) => {
        setMinPrice(value);
    };

    const handleMaxPriceChange = (value) => {
        setMaxPrice(value);
    };

    const handleValidatePressBtn = () => {
        setValidatePressBtn(true);
    };

    let [checkedMaterials, setCheckedMaterials] = useState([]);
    let [checkedCategories, setCheckedCategories] = useState([]);
    let isMaterialsValid = checkedMaterials.length >= 1;
    let isCategoriesValid = checkedCategories.length >= 1;
    

    return (
        <>
            <Form validationBehavior="native">
                <View colorVersion={6}>
                <Flex justifyContent="center" direction="row" gap="size-300" wrap>
                    <TextField 
                        colorVersion="cyan-900"
                        label="Titre"
                        validate={(value) => {
                            if (value === '' && validatePressBtn === true) {
                                return 'Ce champ est obligatoire';
                            }
                        }}
                        isRequired necessityIndicator="icon"
                    />
                    <TextField 
                        label="Description" 
                        validate={(value) => {
                            if (value === '' && validatePressBtn === true) {
                                return 'Ce champ est obligatoire';
                            }
                        }}
                        isRequired necessityIndicator="icon" 
                    />
                    <TextField 
                        label="Prix min€" 
                        maxLength={5}
                        onChange={handleMinPriceChange}
                        type='number'
                        onClick={() => console.log('click')}
                        validate={(value) => {
                            if (value !== '' && value > maxPrice) {
                                return 'Le prix minimum doit être inférieur au prix maximum';
                            }
                            else if (value === '' && validatePressBtn === true) {
                                return 'Ce champ est obligatoire';
                            }
                        }}
                        isRequired necessityIndicator="icon" 
                    />
                    <TextField 
                        label="Prix max€" 
                        maxLength={5}
                        onChange={handleMaxPriceChange}
                        type='number'
                        validate={(value) => {
                            console.log(value);
                            if (value !== '' && value < minPrice) {
                                return 'Le prix maximum doit être supérieur au prix minimum';
                            }
                            else if (value === '' && validatePressBtn === true) {
                                return 'Ce champ est obligatoire';
                            }
                        }}
                        isRequired necessityIndicator="icon" 
                    />
                    <CheckboxGroup
                        marginStart={20}
                        width={200}
                        label="Matériaux" 
                        name="matériaux"
                        onChange={setCheckedMaterials}
                        isInvalid={!isMaterialsValid}
                        isRequired={true}
                        errorMessage={isMaterialsValid && validatePressBtn === false ? '' : 'Sélectionnez au moins un matériau'}
                    >
                        <Checkbox width={200} value="bois">Bois</Checkbox>
                        <Checkbox wwidth={200} value="acier">Acier</Checkbox>
                        <Checkbox value="plastique">Plastique</Checkbox>
                    </CheckboxGroup>
                
                    <CheckboxGroup
                        width={200}
                        label="Catégories" 
                        name="catégories"
                        onChange={setCheckedCategories}
                        isInvalid={!isCategoriesValid}
                        isRequired={true}
                        errorMessage={isCategoriesValid && validatePressBtn === false ? '' : 'Sélectionnez au moins une catégorie'}
                    >
                        <Checkbox value="table">Table</Checkbox>
                        <Checkbox value="lit">Lit</Checkbox>
                        <Checkbox value="fauteuil">Fauteuil</Checkbox>
                    </CheckboxGroup>

                    <ActionButton onClick={handleValidatePressBtn} type="submit"> 
                        <Checkmark />
                        <Text>Appliquer</Text>
                    </ActionButton>
                    <ActionButton type="reset"> 
                        <Delete />
                        <Text>Réinitialiser</Text>
                    </ActionButton>
                </Flex>
                </View>
            </Form>
        </>
    );
}

export default SearchPage;
