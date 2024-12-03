import vsImage from "../../Home/images/Group.svg";
import avatar from "../../AboutUs/images/Your_profil_pict.png";
import badge from "../../Profile/images/badge1.svg";
import "./WarmUp.css";
import "./../Components/gameHistoryItem/GameHistoryitem.css"
import { getUser, getendpoint } from "../../../context/getContextData";
import { createContext, useContext, useEffect, useState } from "react";


interface PlayerCardData {
  enemy?:boolean,
  isRandom?:boolean,
}

interface enemyUserData {
  username: string,
  avatar:string,
  email:string,
  id: number,
}

const socketContext = createContext<WebSocket| null>(null)

const PlayerCard = ({enemy = false, isRandom = false} : PlayerCardData) => {
  const user = getUser()
  const socket = useContext(socketContext)
  const [enemyUser, setEnemyUser] = useState<enemyUserData|null>(null)
  if (socket){
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data)
      console.log(data);
      if (data.event == "HANDSHAKING")
        setTimeout(() => {setEnemyUser(data.enemy)}, 2000);
    }
  }
  return (
    <div className="WarmUpVsPlayer">
      <div className="WarmUpVsImageDiv">
        {
          enemy && !enemyUser ?
          <div className="WarmUpVsPlus" >
            <div>
              <i className={`fa-solid ${ isRandom ? "fa-hourglass-start" : "fa-plus"} fa-2xl`}></i>
            </div>
            <img src={avatar} className="WarmUpVsAvatar" />
          </div>
          :
          (
            enemyUser ?
            <>
              <img src={getendpoint("http", enemyUser.avatar)} className="WarmUpVsAvatar" />
              <img src={badge} className="WarmUpVsBadge" />
            </>
            :
            <>
              <img src={getendpoint("http", user.avatar)} className="WarmUpVsAvatar" />
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
            enemyUser?
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
};


const WarmUpBox = () => {
  return (
    <div className="GameHistoryItem">
      <div className="GameHistoryItemLeft">
        <img src={avatar}/>
        <span>user56789012345</span>
      </div>
      <div className="GameHistoryItemResult">
        <img src={vsImage}/>
      </div>
      <div className="GameHistoryItemRight">
        <span>user56789012345</span>
        <img src={avatar}/>
      </div>
    </div>
  )
}

const ReadyContext = () => {
  const socket = useContext(socketContext)
  const [ready, setReady] = useState<boolean>(false)
  const onReady = () => {
    if (socket){
      socket.send(JSON.stringify({
        "event" : "READY",
      }))
      setReady(true)
    }
  }
  const onAbort = () => {
    if (socket){
      socket.close()
    }
  }
  return (
    <div className="WarmUpReadyContext">
      {/* <div className="WarmupReady"> */}
        <button className="WarmUpReadyBtn" onClick={onReady}>
          {ready ? "Wait" : "Ready"}
        </button>
        <button className="WarmUpAbortBtn"  onClick={onAbort}>
          Abort
        </button>
      {/* </div> */}
    </div>
  )
}

const WarmUp = ({isRandom = true} : {isRandom?:boolean}) => {
  const socket = new WebSocket(getendpoint('ws', '/ws/game/random/'))
  if (socket)
  return (
    <socketContext.Provider value={socket}>
      <div className="GameWarmUp">
        <h2>Warm Up</h2>
        <div className="WarmUpOther">
          <div className="WarmUpVs">
            <PlayerCard />
            <img src={vsImage} className="WarmUpVsImage" />
            <PlayerCard enemy isRandom/>
          </div>
          {/* <div className="WarmUpBox">
            <WarmUpBox/>
          </div> */}
          <ReadyContext/>
        </div>
      </div>
    </socketContext.Provider>
  );
};

export default WarmUp;
