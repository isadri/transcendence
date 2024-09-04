import { useState } from "react";
import "./SideNavbar.css";
import SideNavbarData from "./SideNavbarData";
import logo from "./images/logo1.svg";
import { Link } from "react-router-dom";

const SideNavbar = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [logoutColor, setLogoutColor] = useState("#ffffffcc");
  const handleIconClick = (id: string) => {
    setActiveItem(id);
  };

  const handleLogoutClick = () => {
    setLogoutColor(prevColor => (prevColor === "#ffffffcc" ? "#C1596C" : "#ffffffcc"));
  };

  return (
    <>
      <nav className="Sidebar">
        <img src={logo} alt="logo" className="logo" />
        <ul className="list-items">
          {SideNavbarData.map((val) => {
            const color = activeItem === val.id ? "#C1596C" : "#ffffffcc";
            return (
              <li
                key={val.id}
                onClick={() => handleIconClick(val.id)}
              >
                <Link to={val.link} style={{ color: color }}>
                  {val.icon}
                </Link>
                <hr className={`${activeItem === val.id ? "active" : "inactive"}`}/>
              </li>
            );
          })}
        </ul>
        <i
          className="fa-solid fa-right-from-bracket logout"
          onClick={handleLogoutClick}
          style={{color: logoutColor}}
        ></i>
      </nav>
    </>
  );
};

export default SideNavbar;
