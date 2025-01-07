import "./navBar.css";
import logo from "../../assets/lg.svg";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ResponsiveBar from "./responsiveBar";

function navBar() {
  const [value, setValue] = useState(false);
  const handelClick = () =>{
    setValue(!value)
  }
  const hideNavBar = useLocation().pathname === "/Auth" 
                  || useLocation().pathname === "/callBack/google"
                  || useLocation().pathname === "/callBack/intra"
                  || useLocation().pathname === "/emailVerified"
                  || useLocation().pathname === "/resetPassword"
  return (
    <>
      {!hideNavBar &&
        (<nav className="nav">
          <Link to="/" className="logo">
            <img src={logo} alt="logo" className="logo" />
          </Link>
          <div id="items">
            <ul>
              <li>
                <Link to="/landing">Home</Link>
              </li>
              <li>
                <Link to="/aboutUs">AboutUs</Link>
              </li>
              <li>
                <Link to="/license">License</Link>
              </li>
            </ul>
          </div>
          <div className="buttons">
            <Link to="/Auth">
              <button className="btn" id="loginBtn">
                Join Us
              </button>
            </Link>
          </div>
          <div className="barIcon">
            <i className="fa-solid fa-bars" onClick={handelClick}></i>
          </div>
        </nav>
        )}
        {value === true && !hideNavBar ? <ResponsiveBar setValue={setValue} /> : null}
    </>
  );
}

export default navBar;
