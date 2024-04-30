import { useEffect,useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastQueue } from "@react-spectrum/toast";
import { TextField, Checkbox } from "@adobe/react-spectrum";


const MonCompteEdit = () => {

    

   
    return(
        <>
            <div className="panelAdminAddElement">
                <form>
                    <h1 className="formTitle">Modifier le nom complet</h1>
                    <div>                                               
                        <TextField
                            label="Nom complet"
                            // onChange={setCategoryName}
                            // value={getCategoryName}
                            isRequired
                            width={300}
                                />             
                    </div>

                    <div>
                        <Checkbox>
                            Voulez-vous modifier votre nom actuel ?
                        </Checkbox>
                    </div>
                    <div className="buttons">
                        <Link to="/monCompte" className="form-btn-error">Annuler</Link>
                        <button type="submit" className="form-btn-success" >Modifier</button>
                    </div>                 
                </form>                   
            </div>
        </>
    );
};

export default MonCompteEdit;