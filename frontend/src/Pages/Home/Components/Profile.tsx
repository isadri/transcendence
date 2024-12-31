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
}

export default Profile;
