
import Home from '../Pages/Home/Home';
import Chat from '../Pages/Chat/Chat';
import Profile from '../Pages/Profile/Profile';
import Game from '../Pages/Game/Game';
import Setting from '../Pages/Setting/Setting';

import BackGround from '../components/background/BackGround'
import SideNavbar from '../components/sideNavbar/SideNavbar';
import { createBrowserRouter, Outlet } from "react-router-dom";
import NoPage from "../Pages/NoPage/NoPage";
import Friends from '../Pages/Friends/Friends';
import WarmUp from '../Pages/Game/WarmUp/WarmUp';


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
        path: "/game/warmup/",
        element: <WarmUp />,
      },
      {
        path: "/game/1v1/:gameId",
        element: <Friends />,
      },
    ]
  },
  {
    path: "/setting",
    element: <Setting />
  }
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
    errorElement : <NoPage/>
  }
])


export default mainRouter