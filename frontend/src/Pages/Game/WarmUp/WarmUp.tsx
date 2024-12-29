import vsImage from "../../Home/images/Group.svg";
import avatar from "../../AboutUs/images/Your_profil_pict.png";
import badge from "../../Profile/images/badge1.svg";
import "./WarmUp.css";
import "./../Components/gameHistoryItem/GameHistoryitem.css"
import { getUser, getendpoint } from "../../../context/getContextData";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GameModePopUp from "../../../components/GameModePopUp/GameModePopUp";
import FriendsPopUp from "../Components/FriendsPopUp/FriendsPopUp";


interface PlayerCardData {
  enemy?: boolean,
  isRandom?: boolean,
}

interface EnemyUserData {
  username: string,
  avatar: string,
  email: string,
  id: number,
}

interface ContextData {
  socket: WebSocket | null,
  setSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>,
  enemyUser: EnemyUserData | null
  setEnemyUser: React.Dispatch<React.SetStateAction<EnemyUserData | null>>,
  setDisplayFriends: React.Dispatch<React.SetStateAction<boolean>>,
  ready: boolean,
  setReady: React.Dispatch<React.SetStateAction<boolean>>
}

export const WarmUpContext = createContext<ContextData | null>(null)

const PlayerCard = ({ enemy = false, isRandom = false }: PlayerCardData) => {
  const user = getUser()
  const context = useContext(WarmUpContext)
  const navigator = useNavigate()
  if (context) {
    const { socket, setSocket, enemyUser, setEnemyUser, setReady,setDisplayFriends } = context
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
      console.log('here');
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
                    <img src={badge} className="WarmUpVsBadge" />
                  </>
                  :
                  <>
                    <img src={getendpoint("http", user?.avatar || '')} className="WarmUpVsAvatar" />
                    <img src={badge} className="WarmUpVsBadge" />
                  </>

              )
          }
        </div>
        <div className="WarmUpVsPlayerInfo">
          {
            enemy ?
              <>
                {
                  isRandom
                    ?
                    (
                      enemyUser ?
                        <>
                          <h4>{enemyUser.username}</h4>
                          <h4>4.5 lvl</h4>
                        </>
                        :
                        <h4>waiting ...</h4>
                    )
                    :
                    <h4>Invite a friend</h4>
                }
              </>
              :
              <>
                <h4>{user?.username}</h4>
                <h4>4.5 lvl</h4>
              </>
          }
        </div>
      </div>
    );
  }
}


const WarmUpBox = () => {
  return (
    <div className="GameHistoryItem">
      <div className="GameHistoryItemLeft">
        <img src={avatar} />
        <span>user56789012345</span>
      </div>
      <div className="GameHistoryItemResult">
        <img src={vsImage} />
      </div>
      <div className="GameHistoryItemRight">
        <span>user56789012345</span>
        <img src={avatar} />
      </div>
    </div>
  )
}

const ReadyContext = () => {
  const context = useContext(WarmUpContext)
  if (context) {
    let { socket, ready, setReady, setSocket, setEnemyUser, enemyUser} = context
    console.log(enemyUser);
    
    const onReady = () => {
      if (ready)
        return
      const newSocket = new WebSocket(getendpoint('ws', '/ws/game/random/'))
      setSocket(newSocket)
      newSocket.onopen = () => {
        newSocket.send(JSON.stringify({
          "event": "READY",
        }))
      }
      newSocket.onclose = () => {
        setEnemyUser(null)
      }
      setReady(true)
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
    return (
      <div className="WarmUpReadyContext">
        {/* <div className="WarmupReady"> */}
        <button className="WarmUpReadyBtn" onClick={onReady}>
          {ready ? "Wait" : "Ready"}
        </button>
        <button className="WarmUpAbortBtn" onClick={onAbort}>
          Abort
        </button>
        {/* </div> */}
      </div>
    )
  }
}

const WarmUp = ({ isRandom = false }: { isRandom?: boolean }) => {
  const [ displayFriends, setDisplayFriends ] = useState<boolean>(false)
  let [socket, setSocket] = useState<WebSocket | null>(null)
  const [ready, setReady] = useState<boolean>(false)
  const [enemyUser, setEnemyUser] = useState<EnemyUserData | null>(null)
  return (
    <WarmUpContext.Provider value={{ socket, setSocket, enemyUser, setEnemyUser, ready, setReady, setDisplayFriends }}>
      <div className="GameWarmUp">
        <h2>Warm Up</h2>
        <div className="WarmUpOther">
          <div className="WarmUpVs">
            <PlayerCard />
            <img src={vsImage} className="WarmUpVsImage" />
            <PlayerCard enemy isRandom={isRandom} />
          </div>
          {/* <div className="WarmUpBox">
            <WarmUpBox/>
          </div> */}
          <ReadyContext />
        </div>
      </div>
      {displayFriends ? <FriendsPopUp setter={setDisplayFriends}/> : <></>}
    </WarmUpContext.Provider>
  );
}

export default WarmUp;
