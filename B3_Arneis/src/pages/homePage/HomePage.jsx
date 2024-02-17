import Slider from "../../components/Slider/Slider";
import { testAPI } from '../../services/api';

const HomePage = () => {

    let data = {};
    
    testAPI(data).then(response => {
        if (response.success === true)
        {
            console.log("success");
        }
        else
        {
            console.log("error");
        }
    });

    return(
        <>
            <Slider/>
        </>
    );
};

export default HomePage