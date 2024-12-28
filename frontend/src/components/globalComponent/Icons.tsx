import axios from "axios"
import { useEffect, useState } from "react"
import { getContext, getNotifications, getUnreadCount, getUser, getendpoint } from "../../context/getContextData"
import { Link, useLocation } from "react-router-dom"

function Icons() {
  const context = getContext()
  const notificationList = getNotifications()
  const UnreadNotif = getUnreadCount()
  const [isIconClicked, setIsIconClicked] = useState(false)
  const user = getUser()
  const [isOnline, setIsOnline] = useState<boolean>(user?.is_online || false)
  // const [notificationList, setNotificationList] = useState<NotificationsData[]>([])
  // const [UnreadNotif, setUnreadNotif] = useState(0)

  const hideProfileImg = useLocation().pathname === "/" || useLocation().pathname === "/home"
                        || useLocation().pathname === "/profile"
  const handelNotifacations = () => {
    setIsIconClicked(!isIconClicked)
    axios
      .get(getendpoint("http", "/api/notifications/notifications/"),
      {withCredentials: true})
      .then((response) => {
        console.log("res => " , response.data);
        context?.setNotifications(response.data)
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
        context?.setUnreadCount(0);
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
        context?.setUnreadCount(0);
      })
    }
    axios.get(getendpoint("http", "/api/notifications/unreadNotifications/"),
    {withCredentials: true})
    .then(response => {
        context?.setUnreadCount(response.data.unread_notifications_count)
    })
    .catch(error => {
      console.log(error.response)
    })
    setIsOnline(user?.is_online || false)
  }, [isIconClicked, user?.is_online]);
  // console.log("notf", notificationList)
  return (
    <>
      <span className="Home-Icons">
        <div className="notifIcon">
        {
          UnreadNotif !== 0 && 
          <div className="unreadNotif">
          <span>{UnreadNotif}</span>
          </div>
        }
         <i className="fa-solid fa-bell" onClick={handelNotifacations}></i>
        {
          isIconClicked &&
          <div className="Notifications">
           <div className="topSide">
             <span>Your Notifications</span>
           </div>
            {
              notificationList && notificationList.length > 0 ?
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
        </div>
        { !hideProfileImg && 
          <div className="userInfoGlobal">
            <div className="Home-ProfImg imgGlobal">
              <Link to="/profile" className="img">
                {user && <img src={getendpoint("http", user?.avatar)} alt="" />}
              </Link>
              {
                isOnline &&
                <div className="onlineCircle globalCircle"></div>
              }
            </div>
            {/* <div className="userName">
              <span>{user?.username}</span>
            </div> */}
          </div>
        }
      </span>
    </>
  )
}

export default Icons
