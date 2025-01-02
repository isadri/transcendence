import vsImage from "../../../../../Home/images/Group.svg";
import avatar from "../../../../../AboutUs/images/Your_profil_pict.png";
import badge from "../../../../../Profile/images/badge1.svg";
import "./TournamentWarmUp.css";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, getendpoint } from "../../../../../../context/getContextData";


interface PlayerCardData {
  enemy?: boolean,
  enemyIndex?: number,
  isRandom?: boolean,
}
type EnemysUserData = [ EnemyUserData | null, EnemyUserData | null, EnemyUserData | null]
const emptyEnemys:EnemysUserData = [null, null, null]

interface EnemyUserData {
  username: string,
  avatar: string,
  email: string,
  id: number,
}

interface ContextData {
  socket: WebSocket | null,
  setSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>,
  enemys: EnemysUserData
  setEnemys: React.Dispatch<React.SetStateAction<EnemysUserData>>,
  setDisplayFriends: React.Dispatch<React.SetStateAction<boolean>>,
  ready: boolean,
  setReady: React.Dispatch<React.SetStateAction<boolean>>
}

export const WarmUpContext = createContext<ContextData | null>(null)

const PlayerCard = ({ enemy = false, isRandom = false, enemyIndex=0 }: PlayerCardData) => {
  const user = getUser()
  const context = useContext(WarmUpContext)
  const navigator = useNavigate()
  if (context) {
    const { socket, setSocket, enemys, setEnemys, setReady, setDisplayFriends } = context
    useEffect(() => {
      if (socket)
        socket.onmessage = (e) => {
          const data = JSON.parse(e.data)
          console.log(data);
          if (data.event == "HANDSHAKING") {
            setTimeout(() => { setEnemys([data.enemy, null, null]) }, 2000);
            setTimeout(() => { navigator(`/game/remote/${data.game_id}`) }, 5000);
          }
          if (data.event == "ABORT") {
            setEnemys(emptyEnemys)
            setReady(false)
            socket.close()
          }
        }
    }, [setEnemys, setSocket, socket])

    const inviteFriend = () => {
      console.log('here');
      setDisplayFriends(true)
    }

    return (
      <div className="TournamentWarmUpVsPlayer" >
        <div className="TournamentWarmUpVsImageDiv">
          {
            enemy && !enemys[enemyIndex] ?
              <div className="TournamentWarmUpVsPlus" onClick={inviteFriend}>
                <div>
                  <i className={`fa-solid ${isRandom ? "fa-hourglass-start" : "fa-plus"} fa-2xl`}></i>
                </div>
                <img src={avatar} className="TournamentWarmUpVsAvatar" />
              </div>
              :
              (
                enemy && enemys[enemyIndex] ?
                  <>
                    <img src={getendpoint("http",enemys[enemyIndex]?.avatar || "")} className="TournamentWarmUpVsAvatar" />
                    <img src={badge} className="TournamentWarmUpVsBadge" />
                  </>
                  :
                  <>
                    <img src={getendpoint("http", user?.avatar || '')} className="TournamentWarmUpVsAvatar" />
                    <img src={badge} className="TournamentWarmUpVsBadge" />
                  </>

              )
          }
        </div>
        <div className="TournamentWarmUpVsPlayerInfo">
          {
            enemy ?
              <>
                {
                  enemys[enemyIndex] ?
                    <>
                      <h4>{enemys[enemyIndex]?.username}</h4>
                      <h4>4.5 lvl</h4>
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
                <h4>4.5 lvl</h4>
              </>
          }
        </div>
      </div>
    );
  }
}

const ReadyContext = ({ isRandom = false }: PlayerCardData) => {
  const context = useContext(WarmUpContext)
  if (context) {
    let { socket, ready, setReady, setSocket, setEnemys, enemys } = context
    console.log(enemys);

    const onReady = () => {
      if (ready)
        return
      console.log('isRandom', isRandom)
      const newSocket = new WebSocket(getendpoint('ws', '/ws/game/tournament/random'))
      setSocket(newSocket)
      newSocket.onopen = () => {
        
        newSocket.send(JSON.stringify({
          "event": "READY",
        }))
      }
      newSocket.onclose = () => {
        console.log('s: closed');
        
        setReady(false)
        setEnemys([null, null, null])
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



const TournamentWarmUp = ({ isRandom = false }: { isRandom?: boolean }) => {
  let [socket, setSocket] = useState<WebSocket | null>(null)
  const [ready, setReady] = useState<boolean>(false)
  const [enemys, setEnemys] = useState<EnemysUserData>(emptyEnemys)
  return (
    <WarmUpContext.Provider value={{ socket, setSocket, enemys, setEnemys, ready, setReady }}>
      <div className="TournamentGameWarmUp">
        <h2>Warm Up</h2>
        <div className="TournamentWarmUpOther">
          <div className="TournamentWarmUpVs">
            <PlayerCard isRandom={isRandom} />
            <PlayerCard enemy isRandom={isRandom} />
          </div>
          <div className="TournamentWarmUp TournamentVsOnly">
            <img src={vsImage} className="TournamentWarmUpVsImage" />
          </div>
          <div className="TournamentWarmUpVs">
            <PlayerCard enemy isRandom={isRandom} />
            <PlayerCard enemy isRandom={isRandom} />
          </div>
          <ReadyContext />
        </div>
      </div>
    </WarmUpContext.Provider>
  );
}

export default TournamentWarmUp;
