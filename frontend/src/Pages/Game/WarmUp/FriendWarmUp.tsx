import vsImage from "../../Home/images/Group.svg";
import avatar from "../../AboutUs/images/Your_profil_pict.png";
import "./WarmUp.css";
import "./../Components/gameHistoryItem/GameHistoryitem.css"
import { getContext, getUser, getendpoint } from "../../../context/getContextData";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FriendDataType, userDataType } from "../../../context/context";
import axios from "axios";


interface PlayerCardData {
  enemy?: boolean,
  isRandom?: boolean,
  inviteId?: string | undefined,
}


interface ContextData {
  user: userDataType | null | undefined;
  enemyUser: FriendDataType | null
  setEnemyUser: React.Dispatch<React.SetStateAction<FriendDataType | null>>,
  setDisplayFriends: React.Dispatch<React.SetStateAction<boolean>>,
  ready: boolean,
  setReady: React.Dispatch<React.SetStateAction<boolean>>
}

export const WarmUpContext = createContext<ContextData | null>(null)

const PlayerCard = ({ enemy = false, isRandom = false }: PlayerCardData) => {

  const context = useContext(WarmUpContext)

  

  if (context) {
    const { user, enemyUser, setDisplayFriends } = context
    // useEffect(() => {
    //   if (socket)
    //     socket.onmessage = (e) => {
    //       const data = JSON.parse(e.data)
    //       console.log(data);
    //       if (data.event == "HANDSHAKING") {
    //         setTimeout(() => { setEnemyUser(data.enemy) }, 2000);
    //         setTimeout(() => { navigator(`/game/remote/${data.game_id}`) }, 5000);
    //       }
    //       if (data.event == "ABORT") {
    //         setEnemyUser(null)
    //         setReady(false)
    //         socket.close()
    //       }
    //     }
    // }, [setEnemyUser, setSocket, socket])

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
                      <h4>{enemyUser.stats.level} lvl</h4>
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
                <h4>{user?.stats.level} lvl</h4>
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


const Setup = ({inviteID}:{inviteID:any}) => {
  const globalContext = getContext()
  const context = useContext(WarmUpContext)
  const navigator = useNavigate()
  if (!context)
    return

  const {enemyUser } = context

  useEffect(() => {
    if (!inviteID || !enemyUser) return
    const socket = new WebSocket(getendpoint('ws', `/ws/game/friend/${inviteID}`))
    socket.onopen = () => {
      socket.send(JSON.stringify({
        "event": "READY"
      }))
    }

    socket.onclose = () => {
      // setReady(false)
    }
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data)
      if (data['event'] && data['event'] == 'refused') {
        // setEnemyUser(null)
        globalContext?.setCreatedAlert(data['message'])
        globalContext?.setDisplayed(3)
        setTimeout(() => { navigator(`/game/warmup/friends/`) }, 2000);
      }

      if (data.event == "HANDSHAKING") {
        setTimeout(() => { navigator(`/game/remote/${data.game_id}`) }, 5000);
      }
      if (data.event == "ABORT") {
        globalContext?.setCreatedAlert(data['message'])
        globalContext?.setDisplayed(3)
        setTimeout(() => { navigator(`/game/warmup/friends/`) }, 2000);
        socket.close()
      }
    }
    return () => {
      if (socket && socket.readyState == socket.OPEN)
        socket.close()
    }
  }, [])

  return <></>
}

const FriendWarmUp = ({ isRandom = false }: { isRandom?: boolean }) => {
  const { inviteID } = useParams()
  const tmp_user = getUser()
  const [user, setUser] = useState<userDataType | null | undefined>(tmp_user)
  const navigator = useNavigate()

  const [displayFriends, setDisplayFriends] = useState<boolean>(false)
  const [ready, setReady] = useState<boolean>(false)
  const [enemyUser, setEnemyUser] = useState<FriendDataType | null>(null)
  useEffect(() => {
    if (!user)
      navigator(`/game/warmup/friends/`)
    axios.get(getendpoint("http", `/api/game/invite/${inviteID}`))
      .then((response) => {
        if (user) {
          if (user.id === response.data.invited)
            setEnemyUser(response.data.inviter_data)
          else
            setEnemyUser(response.data.invited_data)
        }
      })
      .catch(() => {
        navigator(`/game/warmup/friends/`) 
      })
  }, [])

  return (
    <WarmUpContext.Provider value={{ enemyUser, setEnemyUser, ready, setReady, setDisplayFriends, user }}>
      <div className="GameWarmUp">
        <h2>Warm Up</h2>
        <div className="WarmUpOther">
          <div className="WarmUpVs">
            <PlayerCard isRandom={isRandom} />
            <img src={vsImage} className="WarmUpVsImage" />
            <PlayerCard enemy isRandom={isRandom} />
          </div>
          {enemyUser && <Setup inviteID={inviteID} />}
        </div>
      </div>
    </WarmUpContext.Provider>
  );
}

export default FriendWarmUp;
