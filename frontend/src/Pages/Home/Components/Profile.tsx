import ProfileImg from "../images/profile.svg";
import Cbadge from "../images/CourentBadge.svg";

function Profile() {
  return (
    <div className="Home-profile">
      <div className="Home-ProfImg">
        <a href="profile">
          <img src={ProfileImg} alt="" />
        </a>
        <a href="profile">
          <span>user1gfhghf</span>
        </a>
      </div>
      <div className="Home-user">
        <img src={Cbadge} alt="" />
      </div>
      <div className="Home-states">
        <div className="Home-level">
          <div className="Home-levelUp">level 1</div>
        </div>
        <div className="Home-comstats-containe">
          <div className="Home-state">
            <div>5</div>
            <div>Wins</div>
          </div>
          <div className="Home-state">
            <div>0</div>
            <div>Loss</div>
          </div>
          <div className="Home-state">
            <div>10</div>
            <div>Rank</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
