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
        <nav className="nav">
          <a href="/" className="logo">
            <img src={logo} alt="logo" className="logo" />
          </a>
          <div id="items">
            <ul>
              <li>
                <a href="/landing">Home</a>
              </li>
              <li>
                <a href="/aboutUs">AboutUs</a>
              </li>
              <li>
                <a href="/license">License</a>
              </li>
            </ul>
          </div>
          <div className="buttons">
            <a href="/signIn">
              <button className="btn" id="loginBtn">
                Sign In
              </button>
            </a>
            <a href="/signUp">
              <button className="btn" id="registerBtn">
                Sign Up
              </button>
            </a>
          </div>
          <div className="barIcon">
            <i className="fa-solid fa-bars" onClick={handelClick}></i>
          </div>
        </nav>
      {value === true ? <ResponsiveBar/> : null}
    </>
  );
}

export default navBar;
