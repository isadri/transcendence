import FirstNavBar from '../components/FirstNavBar/navBar';
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

import Landing from "../Pages/landing/landing";
import SignIn from '../Pages/authentication/SignIn/SignIn';
import License from '../Pages/License/License';
import AboutUs from '../Pages/AboutUs/AboutUs';
import CallBack from '../Pages/CallBack/CallBack';
import EmailVerified from '../Pages/EmailVerified/EmailVerified';

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
  },
  {
    path: "/callBack/:from",
    element: <CallBack />
  },
  {
    path: "/emailVerified",
    element: <EmailVerified />
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
    errorElement : <Navigate to={"/"}/>
  }
])


export default landingRouter