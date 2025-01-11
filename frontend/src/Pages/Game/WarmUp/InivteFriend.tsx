import vsImage from "../../Home/images/Group.svg";
import avatar from "../../AboutUs/images/Your_profil_pict.png";
import "./WarmUp.css";
import "./../Components/gameHistoryItem/GameHistoryitem.css";
import {
	getContext,
	getUser,
	getendpoint,
} from "../../../context/getContextData";
import { createContext, useContext, useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import FriendsPopUp from "../Components/FriendsPopUp/FriendsPopUp";
import { FriendDataType, userDataType } from "../../../context/context";
import axios from "axios";

interface PlayerCardData {
	enemy?: boolean;
	isRandom?: boolean;
	inviteId?: string | undefined;
}


interface ContextData {
	user: userDataType | null | undefined;
	enemyUser: FriendDataType|userDataType | null;
	setEnemyUser: React.Dispatch<React.SetStateAction<FriendDataType|userDataType | null>>;
	setDisplayFriends: React.Dispatch<React.SetStateAction<boolean>>;
	ready: boolean;
	setReady: React.Dispatch<React.SetStateAction<boolean>>;
}

export const WarmUpContext = createContext<ContextData | null>(null);

const PlayerCard = ({ enemy = false, isRandom = false }: PlayerCardData) => {
	const context = useContext(WarmUpContext);
	if (context) {
		const { user, enemyUser, setDisplayFriends } =
			context;
		const inviteFriend = () => {
			setDisplayFriends(true);
		};

		return (
			<div className="WarmUpVsPlayer">
				<div className="WarmUpVsImageDiv">
					{enemy && !enemyUser ? (
						<div className="WarmUpVsPlus" onClick={inviteFriend}>
							<div>
								<i
									className={`fa-solid ${
										isRandom ? "fa-hourglass-start" : "fa-plus"
									} fa-2xl`}
								></i>
							</div>
							<img src={avatar} className="WarmUpVsAvatar" />
						</div>
					) : enemy && enemyUser ? (
						<>
							<img
								src={getendpoint("http", enemyUser.avatar)}
								className="WarmUpVsAvatar"
							/>
						</>
					) : (
						<>
							<img
								src={getendpoint("http", user?.avatar || "")}
								className="WarmUpVsAvatar"
							/>
						</>
					)}
				</div>
				<div className="WarmUpVsPlayerInfo">
					{enemy ? (
						<>
							{enemyUser ? (
								<>
									<h4>{enemyUser.username}</h4>
									<h4>{enemyUser.stats.level} lvl</h4>
								</>
							) : isRandom ? (
								<h4>waiting ...</h4>
							) : (
								<h4>Invite a friend</h4>
							)}
						</>
					) : (
						<>
							<h4>{user?.username}</h4>
							<h4>{user?.stats.level} lvl</h4>
						</>
					)}
				</div>
			</div>
		);
	}
};

const InviteFriend = ({ isRandom = false }: { isRandom?: boolean }) => {
	const [user, setUser] = useState<userDataType | null | undefined>(null);
	const navigator = useNavigate();

	const [displayFriends, setDisplayFriends] = useState<boolean>(false);
	const [ready, setReady] = useState<boolean>(false);
	const [enemyUser, setEnemyUser] = useState<FriendDataType|userDataType | null>(null);
	const globalContext = getContext();

	useEffect(() => {
		if (enemyUser) {
			axios
				.post(getendpoint("http", `/api/game/invite/`), {
					invited: enemyUser.id,
				})
				.then((response) => {
					globalContext?.setCreatedAlert("Invitation sent successfully");
					globalContext?.setDisplayed(5);
					navigator(`/game/warmup/friends/${response.data.id}`);
				})
				.catch((error) => {
					setEnemyUser(null);
					globalContext?.setCreatedAlert(error.response.data.error);
					globalContext?.setDisplayed(3);
				});
		}
	}, [enemyUser]);

	useEffect(() => {
		axios
			.get(getendpoint("http", `/api`), { withCredentials: true })
			.then((response) => {
				setUser(response.data);
			})
			.catch(() => {
				const user = getUser();
				setUser(user);
			});
	}, []);

	return (
		<WarmUpContext.Provider
			value={{
				enemyUser,
				setEnemyUser,
				ready,
				setReady,
				setDisplayFriends,
				user,
			}}
		>
			<div className="GameWarmUp">
				<h2>Warm Up</h2>
				<div className="WarmUpOther">
					<div className="WarmUpVs">
						<PlayerCard isRandom={isRandom} />
						<img src={vsImage} className="WarmUpVsImage" />
						<PlayerCard enemy isRandom={isRandom} />
					</div>
				</div>
			</div>
			{displayFriends && (
				<FriendsPopUp setter={setDisplayFriends} setEnemy={setEnemyUser} />
			)}
		</WarmUpContext.Provider>
	);
};

export default InviteFriend;
