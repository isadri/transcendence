
import Home from '../Pages/Home/Home';
import Chat from '../Pages/Chat/Chat';
import Profile from '../Pages/Profile/Profile';
import Game from '../Pages/Game/Game';
import Setting from '../Pages/Setting/Setting';


import SideNavbar from '../components/sideNavbar/SideNavbar';
import Global from '../components/globalComponent/global';
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Friends from '../Pages/Friends/Friends';
import Play from '../Pages/Game/Play/Play';
import WarmUp from '../Pages/Game/WarmUp/WarmUp';
import Remote from '../Pages/Game/Remote/Remote';
import Local from '../Pages/Game/Tournament/Local/Local';
import { getUser } from '../context/getContextData';
import TournamentRemote from '../Pages/Game/Tournament/Remote/TournamentRemote';


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
        path: "",
        element: <Game />,
      },
      {
        path: "tournament",
        children:[
          {
            path: "local",
            element: <Local />,
          },
          {
            path: "remote",
            children: [
              {
                path: ":id",
                element: <TournamentRemote isRandom={true} ready={true}/>,
              },
              {
                path: "random",
                element: <TournamentRemote isRandom={true}/>,
              }
            ]
          },
        ]
      },
      {
        path: "local",
        element: <Play />,
      },
      {
        path: "remote/:id",
        element: <Remote />,
      },
      {
        path: "warmup",
        children:[
          {
            path: "friends",
            element: <WarmUp />,
          },
          {
            path: "random",
            element: <WarmUp isRandom/>,
          },
        ]
      },
    ]
  },
  {
    path: "/setting",
    element: <Setting />
  },

]

function MainLayout() {
  const user = getUser()
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
  if (!user)
      return <></>
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