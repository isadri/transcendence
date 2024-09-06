import BackGround from './components/background/BackGround'
import SideNavbar from './components/sideNavbar/SideNavbar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Landing from './Pages/landing/landing'

import Home from "./Pages/Home/Home";
import Chat from './Pages/Chat/Chat';
import Profile from './Pages/Profile/Profile';
import Game from "./Pages/Game/Game";
import Setting from "./Pages/Setting/Setting";
import Contact from "./Pages/Contact/Contact";
import NoPage from "./Pages/NoPage/NoPage";


function App() {
  return (
    <>
      <div className='containers'>
        <BackGround><Landing/></BackGround>
      </div>
      <BrowserRouter>
      <BackGround> <SideNavbar/> 
        <Routes>
            <Route  path="home" element={<Home />} />
            <Route path="chat" element={<Chat />} />
            <Route path="profile" element={<Profile />} />
            <Route path="game" element={<Game />} />
            <Route path="setting" element={<Setting />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NoPage />} />
        </Routes>
      </BackGround>
      </BrowserRouter>
    </>
  )
}

export default App
