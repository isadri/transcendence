import vsImage from "../../Home/images/Group.svg";
import avatar from "../../AboutUs/images/Your_profil_pict.png";
import badge from "../../Profile/images/badges/bg1.svg";
import "./WarmUp.css";
import "./../Components/gameHistoryItem/GameHistoryitem.css"
import { getContext, getUser, getendpoint } from "../../../context/getContextData";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FriendsPopUp from "../Components/FriendsPopUp/FriendsPopUp";
import { FriendDataType, userDataType } from "../../../context/context";
import axios from "axios";


interface PlayerCardData {
  enemy?: boolean,
  isRandom?: boolean,
  inviteId?: string | undefined,
}

interface GameInviteData {
  id: number,
  sent_at: string,
  status: string,
  inviter_data: FriendDataType,
  invited_data: FriendDataType,
}

interface ContextData {
  socket: WebSocket | null,
  user:userDataType | null|undefined;
  setSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>,
  enemyUser: FriendDataType | null
  setEnemyUser: React.Dispatch<React.SetStateAction<FriendDataType | null>>,
  setDisplayFriends: React.Dispatch<React.SetStateAction<boolean>>,
  ready: boolean,
  setReady: React.Dispatch<React.SetStateAction<boolean>>
}

export const WarmUpContext = createContext<ContextData | null>(null)

const PlayerCard = ({ enemy = false, isRandom = false }: PlayerCardData) => {

  const context = useContext(WarmUpContext)
  const navigator = useNavigate()
  if (context) {
    const { user, socket, setSocket, enemyUser, setEnemyUser, setReady, setDisplayFriends } = context
    useEffect(() => {
      if (socket)
        socket.onmessage = (e) => {
          const data = JSON.parse(e.data)
          console.log(data);
          if (data.event == "HANDSHAKING") {
            setTimeout(() => { setEnemyUser(data.enemy) }, 2000);
            setTimeout(() => { navigator(`/game/remote/${data.game_id}`) }, 5000);
          }
          if (data.event == "ABORT") {
            setEnemyUser(null)
            setReady(false)
            socket.close()
          }
        }
    }, [setEnemyUser, setSocket, socket])

    const inviteFriend = () => {
      setDisplayFriends(true)
    }

    return (
      <div className="WarmUpVsPlayer" >
        <div className="WarmUpVsImageDiv">
          {
            enemy && !enemyUser ?
              <div className="WarmUpVsPlus" onClick={inviteFriend}>
                <div>
                  <i className={`fa-solid ${isRandom ? "fa-hourglass-start" : "fa-plus"} fa-2xl`}></i>
                </div>
                <img src={avatar} className="WarmUpVsAvatar" />
              </div>
              :
              (
                enemy && enemyUser ?
                  <>
                    <img src={getendpoint("http", enemyUser.avatar)} className="WarmUpVsAvatar" />
                    {/* <img src={badge} className="WarmUpVsBadge" /> */}
                  </>
                  :
                  <>
                    <img src={getendpoint("http", user?.avatar || '')} className="WarmUpVsAvatar" />
                    {/* <img src={badge} className="WarmUpVsBadge" /> */}
                  </>

              )
          }
        </div>
        <div className="WarmUpVsPlayerInfo">
          {
            enemy ?
              <>
                {
                  enemyUser ?
                    <>
                      <h4>{enemyUser.username}</h4>
                      <h4>{enemyUser.stats.level}</h4>
                    </>
                    :
                    (
                      isRandom ?
                        <h4>waiting ...</h4>
                        :
                        <h4>Invite a friend</h4>
                    )

                }
                {/* {
                  isRandom
                    ?
                    (
                      enemyUser ?
                    )
                    :
                } */}
              </>
              :
              <>
                <h4>{user?.username}</h4>
                <h4>{user?.stats.level}</h4>
              </>
          }
        </div>
      </div>
    );
  }
}


// const WarmUpBox = () => {
//   return (
//     <div className="GameHistoryItem">
//       <div className="GameHistoryItemLeft">
//         <img src={avatar} />
//         <span>user56789012345</span>
//       </div>
//       <div className="GameHistoryItemResult">
//         <img src={vsImage} />
//       </div>
//       <div className="GameHistoryItemRight">
//         <span>user56789012345</span>
//         <img src={avatar} />
//       </div>
//     </div>
//   )
// }

const ReadyContext = ({ isRandom = false, inviteId }: PlayerCardData) => {
  const context = useContext(WarmUpContext)
  const globalContext = getContext()
  const navigator = useNavigate()
  if (context) {
    let { socket, ready, setReady, setSocket, setEnemyUser, enemyUser } = context

    const onReady = () => {
      if (ready)
        return
      let newSocket = null;
      if (isRandom) {
        newSocket = new WebSocket(getendpoint('ws', '/ws/game/random'))
      }
      else {
        if (inviteId)
          newSocket = new WebSocket(getendpoint('ws', `/ws/game/friend/${inviteId}`))
        else if (enemyUser) {
          axios.post(getendpoint('http', `/api/game/invite/`), { invited: enemyUser.id })
            .then((response) => {
              console.log('created ', response.data);

              globalContext?.setCreatedAlert("Invitation sent successfully")
              globalContext?.setDisplayed(5)
              navigator(`/game/warmup/friends/${response.data.id}`)

            })
            .catch((error) => {
              console.log(error.response.data)
              globalContext?.setCreatedAlert(error.response.data)
              globalContext?.setDisplayed(3)
            }
            )
        }
      }
      if (newSocket) {
        newSocket.onopen = () => {
          console.log("friend sock open", enemyUser);
          newSocket.send(JSON.stringify({
            "event": "READY"
          }))
        }
        newSocket.onclose = () => {
          console.log("friend sock closed", enemyUser);
          setReady(false)
        }
        setSocket(newSocket)
        setReady(true)
      }
    }
    const onAbort = () => {
      if (socket) {
        socket.send(JSON.stringify({
          "event": "ABORT",
        }))
        socket.close()
        setSocket(null)
        setReady(false)
      }
    }
    console.log(inviteId)
    return (
      <div className="WarmUpReadyContext">
        <button className="WarmUpReadyBtn" onClick={onReady}>
          {ready ? "Wait" : (
            !isRandom && !inviteId ? "invite" : "Ready"
          )}
        </button>
        <button className="WarmUpAbortBtn" onClick={onAbort}>
          Abort
        </button>
      </div>
    )
  }
}

const WarmUp = ({ isRandom = false }: { isRandom?: boolean }) => {
  const { inviteID } = useParams()
  const [user, setUser] = useState<userDataType | null|undefined>(null)
  const navigator = useNavigate()
  const [displayFriends, setDisplayFriends] = useState<boolean>(false)
  let [socket, setSocket] = useState<WebSocket | null>(null)
  const [ready, setReady] = useState<boolean>(false)
  const [enemyUser, setEnemyUser] = useState<FriendDataType | null>(null)

  // if (inviteID && !enemyUser) {
  //   axios.get(getendpoint("http", `/api/game/invite/${inviteID}`))
  //     .then((response) => {
  //       if (user) {
  //         if (user.id === response.data.invited)
  //           setEnemyUser(response.data.inviter_data)
  //         else
  //           setEnemyUser(response.data.invited_data)
  //       }
  //     })
  //     .catch((error) =>  navigator(`/game/warmup/friends/`))
  // }

  useEffect(() => {
    axios.get(getendpoint('http', `/api`), {withCredentials:true})
    .then(response => {
      setUser(response.data);
    })
    .catch(() => {
      const user = getUser()
      setUser(user)
    })
  }, [])
  return (
    <WarmUpContext.Provider value={{ socket, setSocket, enemyUser, setEnemyUser, ready, setReady, setDisplayFriends, user }}>
      <div className="GameWarmUp">
        <h2>Warm Up</h2>
        <div className="WarmUpOther">
          <div className="WarmUpVs">
            <PlayerCard isRandom={isRandom} />
            <img src={vsImage} className="WarmUpVsImage" />
            <PlayerCard enemy isRandom={isRandom} />
          </div>
          {/* <div className="WarmUpBox">
            <WarmUpBox/>
          </div> */}
          <ReadyContext inviteId={inviteID} isRandom={isRandom}/>
        </div>
      </div>
      {/* {displayFriends && <FriendsPopUp setter={setDisplayFriends} />} */}
    </WarmUpContext.Provider>
  );
}

export default WarmUp;
