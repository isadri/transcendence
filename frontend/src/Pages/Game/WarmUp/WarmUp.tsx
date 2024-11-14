import vsImage from "../../Home/images/Group.svg";
import avatar from "../../AboutUs/images/Your_profil_pict.png";
import badge from "../../Profile/images/badge1.svg";
import "./WarmUp.css";
import "./../Components/gameHistoryItem/GameHistoryitem.css"

const PlayerCard = ({enemy = false} : {enemy?:boolean}) => {
  return (
    <div className="WarmUpVsPlayer">
      <div className="WarmUpVsImageDiv">
        {
          true && enemy ?
          <div className="WarmUpVsPlus" >
            <div>
              <i className="fa-solid fa-plus fa-2xl"></i>
            </div>
            <img src={avatar} className="WarmUpVsAvatar" />
          </div>
          :
          <>
            <img src={avatar} className="WarmUpVsAvatar" />
            <img src={badge} className="WarmUpVsBadge" />
          </>
        }
      </div>
      <div className="WarmUpVsPlayerInfo">
        {
        true && enemy ?
        <h4>Invite a friend</h4>
        :
        <>
          <h4>username</h4>
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

const WarmUp = () => {
  return (
    <>
      <div className="GameWarmUp">
        <h2>Warm Up</h2>
        <div className="WarmUpOther">
          <div className="WarmUpVs">
            <PlayerCard />
            <img src={vsImage} className="WarmUpVsImage" />
            <PlayerCard enemy/>
          </div>
          <div className="WarmUpBox">
            <WarmUpBox/>
          </div>
          <ReadyContext/>
        </div>
      </div>
    </>
  );
};

export default WarmUp;
