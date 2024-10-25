import BackGround from './components/background/BackGround'
import FirstNavBar from './components/FirstNavBar/navBar';
import SideNavbar from './components/sideNavbar/SideNavbar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'

import Landing from "./Pages/landing/landing";
import SignIn from './Pages/authentication/SignIn/SignIn';
import AboutUs from './Pages/AboutUs/AboutUs';
import License from './Pages/License/License';
import Home from './Pages/Home/Home';
import Chat from './Pages/Chat/Chat';
import Profile from './Pages/Profile/Profile';
import Game from './Pages/Game/Game';
import Setting from './Pages/Setting/Setting';
import Contact from './Pages/Contact/Contact';
import NoPage from "./Pages/NoPage/NoPage";
import { useState } from 'react';
import Friends from './Pages/Friends/Friends';


function App() {
  let [isLogged, setIsLogged] = useState(true);

  return (
    <>
      <BrowserRouter>
        <BackGround isLogged={isLogged}>
          {
            isLogged ?
              <>
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

              </>
              : (
                // <div className='minP'>
                <>
                  <FirstNavBar />
                  <Routes>
                    <Route index path="/" element={<Landing />} />
                    <Route index path="landing" element={<Landing />} />
                    <Route index path="Auth" element={<SignIn />} />
                    {/* <Route index path="Auth" element={<SignUp/>} /> */}
                    <Route index path="aboutUs" element={<AboutUs />} />
                    <Route index path="license" element={<License />} />
                    <Route path="*" element={<NoPage />} />
                  </Routes>
                </>
                // </div>
              )
          }
        </BackGround>
      </BrowserRouter>
    </>
  )
}

export default App;
