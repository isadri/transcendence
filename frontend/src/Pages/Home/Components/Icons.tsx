import axios from "axios"
import { useEffect, useState } from "react"
import {getendpoint } from "../../../context/getContextData"
import { log } from "console"

interface NotificationsData{
  id: number,
  message : string,
  type: string,
  created_at : string,
  is_read: boolean,
}


function Icons() {
  const [isIconClicked, setIsIconClicked] = useState(false)
  const [notificationList, setNotificationList] = useState<NotificationsData[]>([])
  const [UnreadNotif, setUnreadNotif] = useState(0)

  const handelNotifacations = () => {
    setIsIconClicked(!isIconClicked)
    axios
      .get(getendpoint("http", "/api/notifications/notifications/"),
      {withCredentials: true})
      .then((response) => {
        console.log("res => " , response.data);
        setNotificationList(response.data)
      })
      .catch(error => {
        console.log(error.response)
      })
  }
  
  const handelClearAll = () => {
    axios
      .delete(getendpoint("http", "/api/notifications/clear-all-notif/"), {
        withCredentials: true,
      })
      .then(() => {
        setNotificationList([]);
        setUnreadNotif(0);
      })
      .catch((error) => {
        console.log("Error clearing notifications:", error.response);
      });
  };

  useEffect(() => {
    if(isIconClicked){
      axios.post(getendpoint("http", "/api/notifications/mark-all-read/"),{},
      {withCredentials: true})
      .then(() => {
        setUnreadNotif(0)
      })
    }
    axios.get(getendpoint("http", "/api/notifications/unreadNotifications/"),
    {withCredentials: true})
    .then(response => {
      setUnreadNotif(response.data.unread_notifications_count)
    })
    .catch(error => {
      console.log(error.response)
    })
    const ws = new WebSocket(getendpoint("ws", `/ws/notifications/`));
		ws.onopen = () => console.log("WebSocket connected");
		ws.onclose = () => console.log("WebSocket disconnected");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("data =========> ", data)
      setNotificationList((prev) => [data, ...prev]);
    };
    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, [setNotificationList,notificationList, UnreadNotif, setUnreadNotif, isIconClicked]);
  console.log("notf", notificationList)
  return (
    <>
    {
      UnreadNotif !== 0 && 
      <div className="unreadNotif">
      <span>{UnreadNotif}</span>
      </div>
    }
      <span className='Home-Icons'>
          <div className="notifIcon">
            <i className="fa-solid fa-bell" onClick={handelNotifacations}></i>
          </div>
      </span>
      {
        isIconClicked &&
        <div className="Notifications">
         <div className="topSide">
           <span>Your Notifications</span>
         </div>
          {
            notificationList.length > 0 ?
            <>
              <div className="dropConntent">
              {
                notificationList.map((notif) => (
                  <div  key={notif.id} className="notification-ele">
                    <div className="Notif-info">
                    <span>{notif.type}</span>
                    <span>{notif.created_at}</span>
                    </div>
                  <div className="Notif-msg">
                    <span>{notif.message}</span>
                  </div>
                  </div>
                ))
              }
              </div>
              <div className="footerSide">
                <button onClick={handelClearAll}>Clear All</button>
              </div>
            </>
            :
              <div className="No-Notif">
                <span>No notifications available</span>
              </div>
          }
        
        </div>
      }
    </>
  )
}

export default Icons
