
import Home from '../Pages/Home/Home';
import Chat from '../Pages/Chat/Chat';
import Profile from '../Pages/Profile/Profile';
import Game from '../Pages/Game/Game';
import Setting from '../Pages/Setting/Setting';

import SideNavbar from '../components/sideNavbar/SideNavbar';
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Friends from '../Pages/Friends/Friends';
import Play from '../Pages/Game/Play/Play';
import WarmUp from '../Pages/Game/WarmUp/WarmUp';
import Remote from '../Pages/Game/Remote/Remote';


// isLogged  routing table and layout
const mainRoutingTable = [
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/home",
    element: <Home />
  },
  {
    path: "/chat",
    element: <Chat />
  },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "/friends",
    element: <Friends />
  },
  {
    path: "/game",
    children:[
      {
        path: "/game/",
        element: <Game />,
      },
      {
        path: "/game/local",
        element: <Play />,
      },
      {
        path: "/game/remote/:id",
        element: <Remote />,
      },
      {
        path: "/game/warmup/",
        element: <WarmUp />,
      },
    ]
  },
  {
    path: "/setting",
    element: <Setting />
  },
]

function MainLayout() {
  return (
    <>
      <SideNavbar/>
      <Outlet/>
    </>
  )
}

const mainRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout/>,
    children: mainRoutingTable,
    errorElement : <Navigate to={"/"}/>
  }
])


export default mainRouter