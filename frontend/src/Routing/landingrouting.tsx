import BackGround from '../components/background/BackGround'
import FirstNavBar from '../components/FirstNavBar/navBar';
import { createBrowserRouter, Outlet } from "react-router-dom";

import Landing from "../Pages/landing/landing";
import SignIn from '../Pages/authentication/SignIn/SignIn';
import NoPage from "../Pages/NoPage/NoPage";
import License from '../Pages/License/License';
import AboutUs from '../Pages/AboutUs/AboutUs';

// not Logged  routing table and layout

const landingRoutingTable = [
  {
    path: "/",
    element: <Landing />
  },
  {
    path: "/landing",
    element: <Landing />
  },
  {
    path: "/Auth",
    element: <SignIn />
  },

  {
    path: "/aboutUs",
    element: <AboutUs />
  },
  {
    path: "/license",
    element: <License />
  }
]

function LandingLayout() {
  return (
    <>
      <FirstNavBar/>
      <Outlet/>
    </>
  )
}

const landingRouter = createBrowserRouter([
  {
    path: '/',
    element: <LandingLayout/>,
    children: landingRoutingTable,
    errorElement : <NoPage/>
  }
])


export default landingRouter