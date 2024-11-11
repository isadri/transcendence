import vsImage from "../../Home/images/Group.svg";
import avatar from "../../AboutUs/images/Your_profil_pict.png";
import badge from "../../Profile/images/badge1.svg";
import "./WarmUp.css";

const PlayerCard = () => {
  return (
    <div className="WarmUpVsPlayer">
      <div className="WarmUpVsImageDiv">
        <img src={avatar} className="WarmUpVsAvatar" />
        <img src={badge} className="WarmUpVsBadge" />
      </div>
      <div className="WarmUpVsPlayerInfo">
        <h4>username</h4>
        <h4>4.5 lvl</h4>
      </div>
    </div>
  );
};


// const WarmUp

const WarmUp = () => {
  return (
    <>
      <div className="GameWarmUp">
        <h2>Warm Up</h2>
        <div className="WarmUpOther">
          <div className="WarmUpVs">
            <PlayerCard />
            <img src={vsImage} className="WarmUpVsImage" />
            <PlayerCard />
          </div>
          <div className="WarmUpMiniVs">

          </div>
        </div>
      </div>
    </>
  );
};

export default WarmUp;
