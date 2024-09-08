import "./navBar.css";
import logo from "../../assets/lg.svg";
import { useState } from "react";
import ResponsiveBar from "./responsiveBar";

function navBar() {
  const [value, setValue] = useState(false);
  const handelClick = () =>{
    if (value === false)
      setValue(true);
    else
      setValue(false);
  }
  return (
    <>
      <div className="navBar">
        <nav className="nav">
          <a href="#" className="logo">
            <img src={logo} alt="logo" className="logo" />
          </a>
          <div id="items">
            <ul>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">AboutUs</a>
              </li>
              <li>
                <a href="#">License</a>
              </li>
            </ul>
          </div>
          <div className="buttons">
            <button className="btn" id="loginBtn">
              Sign In
            </button>
            <button className="btn" id="registerBtn">
              Sign Up
            </button>
          </div>
          <div className="barIcon">
            <i className="fa-solid fa-bars" onClick={handelClick}></i>
          </div>
        </nav>
      {value === true ? <ResponsiveBar/> : null}
      </div>
    </>
  );
}

export default navBar;
