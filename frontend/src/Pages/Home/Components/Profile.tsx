import ProfileImg from "../images/profile.svg";
import Cbadge from "../images/CourentBadge.svg";

function Profile() {
  return (
    <div className="profile">
      <div className="ProfImg">
        <a href="profile">
          <img src={ProfileImg} alt="" />
        </a>
        <a href="profile">
          <span>user1gfhghf</span>
        </a>
      </div>
      <div className="user">
        <img src={Cbadge} alt="" />
      </div>
      <div className="states">
        <div className="level">
          <div className="levelUp">level 1</div>
        </div>
        <div className="comstats-containe">
          <div className="state">
            <div>5</div>
            <div>Wins</div>
          </div>
          <div className="state">
            <div>0</div>
            <div>Loss</div>
          </div>
          <div className="state">
            <div>10</div>
            <div>Rank</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
