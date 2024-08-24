import {useState, useEffect} from 'react';
import { Data } from '../../services/api';
import { ToastQueue } from '@react-spectrum/toast';

export default function SliderProduct({ productId }) {
    // Setting use states
    const [currentIndex, setCurrentIndex] = useState(0);
    const [getSliderImages, setSliderImages] = useState([]);

    // Get the slider images from the database
    useEffect(() => {
        Data("product", "getProductDetail", { table: "products", id: productId }).then(response => {
            if (response.success === true) {
                setSliderImages(response.data);  
                setCurrentIndex(1);         
            } else {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
    }, [productId]);

    // Function to increase the index of the slider and update the image to show
    const plusSlides = (n) => {
        let newIndex = currentIndex + n;
        if(newIndex <= 0)
        {
            newIndex = getSliderImages.length;
        } else if(newIndex > getSliderImages.length)
        {
            newIndex = 1;
        }
        setCurrentIndex(newIndex);
    }

    // Everytime the index is changed, we start a new timer of 5 seconds after what we will increase the index to show another image
    useEffect(() => {
        const intervalId = setInterval(() => {
            plusSlides(1);
        }, 5000);

        return () => {
            clearInterval(intervalId);
        };
    }, [currentIndex]);

    return (
        <section className="sliderProduct">

            <div className="slideshow">
                {getSliderImages && getSliderImages.map((image, index) => (
                    <div className="mySlides fade" key={"image" + image.id + "-" + index} style={{display: index + 1 === currentIndex ? 'block' : 'none'}}>
                        <img className="sliderImage" src={`/img/${image.image_name}`}/>
                    </div>
                ))}

                <a className="prev" onClick={() => plusSlides(-1)}>&#10094;</a>
                <a className="next" onClick={() => plusSlides(1)}>&#10095;</a>

                <div style={{textAlign: "center"}}>
                    {getSliderImages && getSliderImages.map((image, index) => (
                        <span className={index + 1 === currentIndex ? "dot active" : "dot"} onClick={() => setCurrentIndex(index + 1)} key={"btn" + image.id + "-" + index}></span>
                    ))}
                </div>
            </div>
            <br/>

        </section>
    )
}
