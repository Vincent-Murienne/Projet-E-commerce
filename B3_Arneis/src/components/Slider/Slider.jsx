import React, {useState} from 'react'
import dataSlider from './dataSlider'

export default function Slider() {
    const [currentIndex, setCurrentIndex] = useState(1);

    const plusSlides = (n) => {
        let newIndex = currentIndex + n;
        if(newIndex <= 0)
        {
            newIndex = dataSlider.length;
        } else if(newIndex > dataSlider.length)
        {
            newIndex = 1;
        }
        setCurrentIndex(newIndex);
    }

  return (
    <section className="slider">

        <div className="slideshow">
            {
                dataSlider.map((obj, index) => {
                    return (
                        <div className="mySlides fade" key={obj.id} style={{display: index + 1 === currentIndex ? 'block' : 'none'}}>
                            <img className="sliderImage" src={`/img/${obj.img}`}/>
                        </div>
                    )
                })
            }
            
            

            <a className="prev" onClick={() => plusSlides(-1)}>&#10094;</a>
            <a className="next" onClick={() => plusSlides(1)}>&#10095;</a>

            <div style={{textAlign: "center"}}>
                {
                    dataSlider.map((obj, index) => {
                        return (
                            <span className={index + 1 === currentIndex ? "dot active" : "dot"} onClick={() => setCurrentIndex(index + 1)} key={obj.id}></span>
                        )
                    })
                }
            </div>
        </div>
        <br/>

    </section>
  )
}
