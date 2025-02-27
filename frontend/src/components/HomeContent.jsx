import {Link} from "react-router-dom";
import Bgimage from "../images/home/hero-bg.png";
import CarImage from "../images/home/main-car.png";
import { useEffect, useState } from "react";

function HomeContent () {
    const [goUp,setGoUp] = useState(false);
    const scrollToTop = () =>{
        window.scrollTo({ top:(0,0),behavior : "smooth"});
    };
    const bookBtn = () => {
        document
            .querySelector("#booking-section")
            .scrollIntoView({behavior :"smooth"});
    };

    useEffect(() => {
        const onPageScroll = () => {
            if (window.pageYOffset > 600) {
                setGoUp(true);
            }else{
                setGoUp(false);
            }
        };
        window.addEventListener("scroll", onPageScroll);
        return () =>{
            window.removeEventListener("scroll",onPageScroll);
        };
    },[]);
    return (
        <>
        <section id="home" className="hero-section">
            <div className="container">
               <img className="bg-shape" src={Bgimage} alt="bg-shape"/>
               <div className="hero-content">
                <div className="hero-content__text">
                    <h4>Plan your trip now</h4>
                    <h1>
                        Book with us and save big
                    </h1>
                    <p>Rent the car of your dreams. Unbeatable prices, unlimited miles,
                    flexible pick-up options and much more.</p>
                    <div className="hero-content__text__btns">
                <Link
                  onClick={bookBtn}
                  className="hero-content__text__btns__book-ride"
                  to="/"
                >
                 Book Ride &nbsp; <i className="fa-solid fa-circle-check"></i>
                </Link>
                <Link className="hero-content__text__btns__learn-more" to="/">
                  Learn More &nbsp; <i className="fa-solid fa-angle-right"></i>
                </Link>
                </div>
               </div>
               <img
              src={CarImage}
              alt="car-img"
              className="hero-content__car-img"
            />
          </div>
        </div>
        <div
          onClick={scrollToTop}
          className={`scroll-up ${goUp ? "show-scroll" : ""}`}
        >
          <i className="fa-solid fa-angle-up"></i>
        </div>

        </section>
        </>
    )
}
export default HomeContent;
