// import ProfileImg from "../images/profile.svg";
import bg1 from "../../Profile/images/badges/bg1.svg";
import bg2 from "../../Profile/images/badges/bg2.svg";
import bg3 from "../../Profile/images/badges/bg3.svg";
import bg4 from "../../Profile/images/badges/bg4.svg";
import bg5 from "../../Profile/images/badges/bg5.svg";
import { getUser, getendpoint } from "../../../context/getContextData";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { stats } from "../../../context/context";
// line 14 check emergncy
function Profile() {
	const user = getUser();
	//   const [percentage, setPercentage] = useState(0);
	const [stats, setStats] = useState<stats>()
	const [isOnline, setIsOnline] = useState<boolean>(user?.is_online || false);

	if (user) {
		useEffect(() => {
			setIsOnline(user?.is_online || false);
		}, [user.is_online, user?.stats]);

		useEffect(() => {
			axios.get(getendpoint("http", `/api/game/userStats/${user.username}`))
				.then((response) => {
					setStats(response.data[0])
					console.log(response.data[0])
				})
				.catch((error) => {
					console.log(error)
				})
		}, []);
		var percentage = 0
		if (stats)
			percentage = (stats.xp * 100) / ((stats.level + 1) * 100)
		return (
			<div className="Home-profile">
				<div className="Home-ProfImg">
					<Link to="/profile" className="img">
						<img src={getendpoint("http", user?.avatar)} alt="" />
					</Link>
					{
						isOnline && (
							// <div className="ParentCircle">
							<div className="onlineCircle"></div>
						)
						// </div>
					}
					<Link to="/profile">
						<span>{user?.username}</span>
					</Link>
				</div>
				<div className="Home-user">
					{
						stats?.badge === -1 &&
						<img className="noImg" src={bg1} alt="" />
					}
					{
						stats?.badge === 0 &&
						<img src={bg1} alt="" />
					}
					{
						stats?.badge === 1 &&
						<img src={bg2} alt="" />
					}
					{
						stats?.badge === 2 &&
						<img src={bg3} alt="" />
					}
					{
						stats?.badge === 3 &&
						<img src={bg4} alt="" />
					}
					{
						stats?.badge === 4 &&
						<img src={bg5} alt="" />
					}
				</div>
				<div className="Home-states">
					<div className="Home-level-bar leve-dashbord">
						<div
							className="Home-level-bar-fill"
							style={{ width: `${percentage}%` }}
						></div>
						<span className="Home-level-text">
							Level {stats && Math.floor(stats.level)} - {Math.round(percentage)}%
						</span>
					</div>
					<div className="Home-comstats-containe">
						<div className="Home-state">
							<div>{stats?.win}</div>
							<div>Wins</div>
						</div>
						<div className="Home-state">
							<div>{stats?.lose}</div>
							<div>Loss</div>
						</div>
						<div className="Home-state">
							<div>{stats?.nbr_games}</div>
							<div>Total</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Profile;
