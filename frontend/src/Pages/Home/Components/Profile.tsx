// import ProfileImg from "../images/profile.svg";
import Cbadge from "../images/CourentBadge.svg";
import { getUser, getendpoint } from "../../../context/getContextData";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
// line 14 check emergncy
function Profile() {
  const user = getUser()
  const [isOnline, setIsOnline] = useState<boolean>(user?.is_online || false)

  useEffect(() => {
    setIsOnline(user?.is_online || false)
  }, [user?.is_online])
  if (user)
  {
    const fractionalPart = user.stats.level - Math.floor(user.stats.level);
    const percentage = fractionalPart * 100;
    return (
      <div className="Home-profile">
        <div className="Home-ProfImg">
          <Link to="/profile" className="img">
            <img src={getendpoint("http", user?.avatar)} alt="" />
          </Link>
          {
            isOnline &&
            // <div className="ParentCircle">
              <div className="onlineCircle"></div>
            // </div>
          }
          <Link to="/profile">
            <span>{user?.username}</span>
          </Link>
        </div>
        <div className="Home-user">
          <img src={Cbadge} alt="" />
        </div>
        <div className="Home-states">
          <div className="Home-level-bar leve-dashbord">
            <div className="Home-level-bar-fill" style={{width: `${percentage}%`}}></div>
            <span className="Home-level-text">Level {Math.floor(user.stats.level)} - {Math.round(percentage)}%</span>
          </div>
          <div className="Home-comstats-containe">
            <div className="Home-state">
              <div>{user.stats.win}</div>
              <div>Wins</div>
            </div>
            <div className="Home-state">
              <div>{user.stats.lose}</div>
              <div>Loss</div>
            </div>
            <div className="Home-state">
              <div>{user.stats.nbr_games}</div>
              <div>Total</div>  
            </div>
         </div>
        </div>
      </div>
    );
  }
}

export default Profile;
