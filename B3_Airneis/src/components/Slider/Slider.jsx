import React, {useState, useEffect} from 'react';
import { Data } from '../../services/api';
import { ToastQueue } from '@react-spectrum/toast';

export default function Slider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [getSliderImages, setSliderImages] = useState([]);

    // Get the slider images from the database
    let data = {
        "table": "images"
    };

    useEffect(() => {
        Data("panelAdmin", "getTop", data).then(response => {
            if (response.success === true)
            {
                setSliderImages(response.data);
                setCurrentIndex(currentIndex+1);
            }
            else
            {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
    }, []);

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
        <section className="slider">

            <div className="slideshow">
                {getSliderImages && getSliderImages.map((image, index) => (
                    <div className="mySlides fade" key={image.id} style={{display: index + 1 === currentIndex ? 'block' : 'none'}}>
                        <img className="sliderImage" src={`/img/${image.name}`}/>
                    </div>
                ))}

                <a className="prev" onClick={() => plusSlides(-1)}>&#10094;</a>
                <a className="next" onClick={() => plusSlides(1)}>&#10095;</a>

                <div style={{textAlign: "center"}}>
                    {getSliderImages && getSliderImages.map((image, index) => (
                        <span className={index + 1 === currentIndex ? "dot active" : "dot"} onClick={() => setCurrentIndex(index + 1)} key={image.id}></span>
                    ))}
                </div>
            </div>
            <br/>

        </section>
    )
}
