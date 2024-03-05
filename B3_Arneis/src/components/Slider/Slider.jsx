import React, {useState, useEffect} from 'react';
import { Data } from '../../services/api';

export default function Slider() {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [getSliderImages, setSliderImages] = useState([]);

    let data = {
        "table": "images"
    };

    useEffect(() => {
        Data("homePage", "getTop", data).then(response => {
            if (response.success === true)
            {
                console.log(response);
                setSliderImages(response.data);
            }
            else
            {
                console.log(response.error);
            }
        });
    }, []);

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
