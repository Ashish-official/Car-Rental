function Footer () {
    return (
        <>
        <footer>
            <div className = "container">
                <div className="footer-content">
                    <ul className="footer-content__1">
                    <li>
                <span>CAR</span> Rental
              </li>
              <li>
                We offers a big range of vehicles for all your driving needs. We
                have the perfect car to meet your needs.
              </li>
              <li>
                <a href="tel:7041336594">
                  <i className="fa-solid fa-phone"></i> &nbsp; 7041336594
                </a>
              </li>

              <li>
                <a
                  href="mailto: 
                rental@gmail.com"
                >
                  <i className="fa-solid fa-envelope"></i>
                  &nbsp; rental@gmail.com
                </a>
              </li>
                        
                    </ul>
                    <ul className="footer-content__2">
                        <li>Company</li>
                        <li>
                            <a href="#home">Gallery</a>
                        </li>
                        <li>
                            <a href="#home">Mobile</a>
                        </li>
                        <li>
                           <a href="#home">Blog</a>
                        </li>
                        <li>
                           <a href="#home">How we work</a>
                        </li>
                    </ul>
                    <ul className="footer-content__2">
                    <li>Subscription</li>
                    <li>
                        <p>Subscribe by your Email address for latest news & updates.</p>
                    </li>
                    <li>
                        <input type="email" placeholder="Enter Email Address"></input>
                    </li>
                    <li>
                        <button className="submit-email">Submit</button>
                    </li>
                    </ul>
                </div>
            </div>
        </footer>
        </>
    )
}
export default Footer;
