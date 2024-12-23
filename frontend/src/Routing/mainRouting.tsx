
import Home from '../Pages/Home/Home';
import Chat from '../Pages/Chat/Chat';
import Profile from '../Pages/Profile/Profile';
import Game from '../Pages/Game/Game';
import Setting from '../Pages/Setting/Setting';

// import BackGround from '../components/background/BackGround'
// import SideNavbar from '../components/sideNavbar/SideNavbar';
// import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
// import NoPage from "../Pages/NoPage/NoPage";
// import Friends from '../Pages/Friends/Friends';
// import Play from '../Pages/Game/Play/Play';
// import Tictactoe from '../Pages/TicTacToe/Tictactoe';
// import { Children } from 'react';
import SideNavbar from '../components/sideNavbar/SideNavbar';
import Global from '../components/globalComponent/global';
import { createBrowserRouter, Navigate, Outlet, /*useNavigate*/ } from "react-router-dom";
import Friends from '../Pages/Friends/Friends';
import Play from '../Pages/Game/Play/Play';
import WarmUp from '../Pages/Game/WarmUp/WarmUp';
import Remote from '../Pages/Game/Remote/Remote';
// import { getContext, getUser } from '../context/getContextData';
// import { useEffect } from 'react';


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
    children: [
    {
      path: "",
      element: <Profile />
    },
    {
      path: ":username",
      element: <Profile />
    }
]
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
  // const user = getUser()
  // const context = getContext()

  // const navigate = useNavigate()
  // useEffect(() => {
  //   if (!context) return
  //   const {setIsLogged} = context
  //   if (!user?.register_complete)
  //   {
  //     navigate('/Auth')
  //     setIsLogged(false)
  //     console.log("hello")
  //   }
  // }, [user])
  return (
    <>
      <SideNavbar/>
  
      <div className='mainContent'>
        <Global/>
        <Outlet/>
      </div>
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