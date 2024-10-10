import BackGround from "./components/background/BackGround";
import SideNavbar from "./components/sideNavbar/SideNavbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./Pages/Home/Home";
import Chat from "./Pages/Chat/Chat";
import Profile from "./Pages/Profile/Profile";
import Game from "./Pages/Game/Game";
import Setting from "./Pages/Setting/Setting";
import Contact from "./Pages/Contact/Contact";
import NoPage from "./Pages/NoPage/NoPage";
import Friends from "./Pages/Friends/Friends";

function App() {
	return (
		<>
			<BrowserRouter>
				<BackGround>
					{" "}
					<SideNavbar />
					<Routes>
						<Route index path="/" element={<Home />} />
						<Route index path="home" element={<Home />} />
						<Route path="chat" element={<Chat />} />
						<Route path="profile" element={<Profile />} />
						<Route path="friends" element={<Friends />} />
						<Route path="game" element={<Game />} />
						<Route path="setting" element={<Setting />} />
						<Route path="contact" element={<Contact />} />
						<Route path="*" element={<NoPage />} />
					</Routes>
				</BackGround>
			</BrowserRouter>
		</>
	);
}

export default App;
