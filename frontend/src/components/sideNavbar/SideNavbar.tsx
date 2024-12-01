import { useContext, useState } from "react";
import "./SideNavbar.css";
import SideNavbarData from "./SideNavbarData";
import { Link,useNavigate } from "react-router-dom";
import logo from "./images/logo1.svg";
import "./SidenavbarMobile.css";
import { useMediaQuery } from "@uidotdev/usehooks"; // npm i @uidotdev/usehooks
import { useLocation } from "react-router-dom";
import axios from "axios";
import { loginContext } from "../../App";
import { getendpoint } from "../../context/getContextData";

const SideNavbar = () => {
	const authContext = useContext(loginContext)
	const navigate = useNavigate();
	const pathname = useLocation().pathname;
	const isSmallDevice = useMediaQuery("only screen and (max-width : 478px)");
	const [activeItem, setActiveItem] = useState<string>(pathname);
	const [logoutColor, setLogoutColor] = useState("#ffffffcc");
	const handleIconClick = (id: string) => {
		setActiveItem(id);
	};

	const [desplayMenu, setDesplayMenu] = useState(false);
	const handleMenuClick = () => {
		setDesplayMenu(!desplayMenu);
	};

	const handleLogoutClick = () => {
		axios.get(getendpoint('http', '/api/accounts/logout/'), {withCredentials:true})
      		.then(() =>{
				authContext?.setIsLogged(false)
				navigate('/')
				// console.log("saccess")
      		})
      		.catch(() => {
      			// console.log("failer")
      		})
		setLogoutColor((prevColor) =>
			prevColor === "#ffffffcc" ? "#C1596C" : "#ffffffcc"
		);
	};

	return (
		<>
			{isSmallDevice ? (
				<nav className="SidebarMobile">
					<div className="closeNavbarMobile">
						<img src={logo} alt="logo" className="logoMobile" />
						<div className="menu-notiMobile">
							<i className="fa-solid fa-bell notificationMobile"></i>
							<i
								className={`${
									desplayMenu === true
										? "inactive"
										: "fa-solid fa-bars menuMobile"
								}`}
								onClick={handleMenuClick}
							></i>
							<i
								className={`${
									desplayMenu === false
										? "inactive"
										: "fa-solid fa-xmark xmarkMobile"
								}`}
								onClick={handleMenuClick}
							></i>
						</div>
					</div>
					{desplayMenu && (
						<ul className={`${"list-itemsMobile"}`}>
							{/* <hr /> */}
							{SideNavbarData.map((val) => {
								const color = val.link.includes(activeItem)
									? "#C1596C"
									: "#ffffffcc";
								return (
									<li key={val.id} onClick={() => handleIconClick(val.link[0])}>
										<Link
											to={val.link[0]}
											style={{ color: color }}
											className="rowMobile"
											onClick={handleMenuClick}
										>
											<div id="iconMobile"> {val.icon} </div>
											<div className="nameMobile"> {val.name} </div>
										</Link>
									</li>
								);
							})}
							<hr />
							<li key='"logout' onClick={() => handleIconClick("logout")}>
								<Link
									to="/home"
									className="rowMobile"
									id="logoutMobile"
									style={{ color: "#ffffffcc" }}
									onClick={handleMenuClick}
								>
									<div id="iconMobile">
										<i className="fa-solid fa-right-from-bracket "></i>
									</div>
									<div className="nameMobile"> Logout </div>
								</Link>
							</li>
						</ul>
					)}
				</nav>
			) : (
				<nav className="Sidebar">
					<img src={logo} alt="logo" className="logo" />
					<ul className="list-items">
						{SideNavbarData.map((val) => {
							const color = val.link.includes(activeItem)
								? "#C1596C"
								: "#ffffffcc";
							return (
								<li key={val.id} onClick={() => handleIconClick(val.link[0])}>
									<Link to={val.link[0]} style={{ color: color }}>
										{val.icon}
									</Link>
									<hr
										className={`${
											val.link.includes(activeItem) ? "active" : "inactive"
										}`}
									/>
								</li>
							);
						})}
					</ul>
					<i
						className="fa-solid fa-right-from-bracket logout"
						onClick={handleLogoutClick}
						style={{ color: logoutColor }}
					></i>
				</nav>
			)}
		</>
	);
};

export default SideNavbar;
