import vsImage from "../../Home/images/Group.svg";
import avatar from "../../AboutUs/images/Your_profil_pict.png";
import badge from "../../Profile/images/badge1.svg";
import "./WarmUp.css";
import "./../Components/gameHistoryItem/GameHistoryitem.css"
import { getUser, getendpoint } from "../../../context/getContextData";


interface PlayerCardData {
  enemy?:boolean,
  isRandom?:boolean,
}

const PlayerCard = ({enemy = false, isRandom = false} : PlayerCardData) => {
  const user = getUser()
  return (
    <div className="WarmUpVsPlayer">
      <div className="WarmUpVsImageDiv">
        {
          enemy ?
          <div className="WarmUpVsPlus" >
            <div>
              <i className={`fa-solid ${ isRandom ? "fa-hourglass-start" : "fa-plus"} fa-2xl`}></i>
            </div>
            <img src={avatar} className="WarmUpVsAvatar" />
          </div>
          :
          <>
            <img src={getendpoint("http", user.avatar)} className="WarmUpVsAvatar" />
            <img src={badge} className="WarmUpVsBadge" />
          </>
        }
      </div>
      <div className="WarmUpVsPlayerInfo">
        {
        enemy ?
        <>
        {
          isRandom
          ?
          <h4>waiting ...</h4>
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
  return (
    <div className="WarmUpReadyContext">
      {/* <div className="WarmupReady"> */}
        <button className="WarmUpReadyBtn">
          Ready
        </button>
        <button className="WarmUpAbortBtn">
          Abort
        </button>
      {/* </div> */}
    </div>
  )
}

const WarmUp = ({isRandom = true} : {isRandom?:boolean}) => {
  return (
    <>
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
    </>
  );
};

export default WarmUp;
