import BackGround from './components/background/BackGround'
import { RouterProvider } from "react-router-dom";
import './App.css'

import { useEffect, useState } from 'react';
import mainRouter from './Routing/mainRouting';
import landingRouter from './Routing/landingrouting';
import axios from 'axios';

import { loginContext } from './context/context';
import { userDataType, NotificationsData } from './context/context';
import { getendpoint } from './context/getContextData';


function App() {
  let [isLogged, setIsLogged] = useState<boolean | null>(null)
  let [user, setUser] = useState<userDataType | null>(null)
  let [createdAlert, setCreatedAlert] = useState('')
  let [Displayed, setDisplayed] = useState(1)

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationsData[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  axios.defaults.withCredentials = true
  const getUserInfo = () => {
    axios.get(getendpoint('http', "/"))
        .then((response: any) => {
          console.log("response.data => ", { ...response.data, is_online: true })
  
          setUser({ ...response.data, is_online: true })
          setIsLogged(true)
        })
        .catch(() => {
          setIsLogged(false)
          setUser(null)
        })
  }
  useEffect(() => {

    // if (isLogged) {
      console.log("hello, ", user)
      const ws = new WebSocket(getendpoint("ws", `/ws/notifications/`));
      ws.onopen = () => {
        getUserInfo()
        console.log("WebSocket connected ", user?.is_online);
      }
      ws.onclose = () => {
        getUserInfo()
        console.log("WebSocket disconnected ", user?.is_online);
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setNotifications((prev) => [data, ...prev]);
        setUnreadCount((prev) => prev + 1);
      };
      return () => {
        ws.close();
      };
    // }
  }, [setIsLogged, isLogged])

  if (isLogged == null)
    return <></>
  return (
    <loginContext.Provider value={{
      user, setUser, isLogged, setIsLogged,
      createdAlert, setCreatedAlert, Displayed, setDisplayed, notifications,
      setNotifications, setUnreadCount, unreadCount
    }}>
      <BackGround isLogged={isLogged}>
        <RouterProvider router={isLogged ? mainRouter : landingRouter} />
      </BackGround>
    </loginContext.Provider>
  )
}

export { loginContext }
export default App;