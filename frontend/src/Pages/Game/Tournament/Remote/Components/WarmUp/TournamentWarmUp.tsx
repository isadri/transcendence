import vsImage from "../../../../../Home/images/Group.svg";
import avatar from "../../../../../AboutUs/images/Your_profil_pict.png";
import badge from "../../../../../Profile/images/badges/bg1.svg";
import "./TournamentWarmUp.css";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, getendpoint } from "../../../../../../context/getContextData";
import axios from "axios";
import {
	FriendDataType,
	userDataType,
} from "../../../../../../context/context";

interface PlayerCardData {
	enemy?: boolean;
	enemyIndex?: number;
	isRandom?: boolean;
}
type EnemiesUserData = [
	EnemyUserData | null,
	EnemyUserData | null,
	EnemyUserData | null
];
const emptyEnemies: EnemiesUserData = [null, null, null];

type EnemyUserData = FriendDataType;
interface ContextData {
	socket: WebSocket | null;
	user: userDataType | null | undefined;
	setSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>;
	enemies: EnemiesUserData;
	setEnemies: React.Dispatch<React.SetStateAction<EnemiesUserData>>;
	ready: boolean;
	setReady: React.Dispatch<React.SetStateAction<boolean>>;
}

export const WarmUpContext = createContext<ContextData | null>(null);

const PlayerCard = ({
	enemy = false,
	isRandom = false,
	enemyIndex = 0,
}: PlayerCardData) => {
	const context = useContext(WarmUpContext);
	const navigator = useNavigate();
	if (context) {
		const { socket, setSocket, enemies, setEnemies, setReady, user } = context;
		useEffect(() => {
			if (socket)
				socket.onmessage = (e) => {
					const data = JSON.parse(e.data);
					console.log(data);
					if (data.event == "HANDSHAKING") {
						setTimeout(() => {
							setEnemies(data.enemies);
						}, 2000);
						setTimeout(() => {
							navigator(`/game/tournament/remote/${data.tournament}`);
						}, 5000);
					}
					if (data.event == "ABORT") {
						setEnemies(emptyEnemies);
						setReady(false);
						socket.close();
					}
				};
		}, [setEnemies, setSocket, socket]);

		return (
			<div className="TournamentWarmUpVsPlayer">
				<div className="TournamentWarmUpVsImageDiv">
					{enemy && !enemies[enemyIndex] ? (
						<div className="TournamentWarmUpVsPlus">
							<div>
								<i
									className={`fa-solid ${
										isRandom ? "fa-hourglass-start" : "fa-plus"
									} fa-2xl`}
								></i>
							</div>
							<img src={avatar} className="TournamentWarmUpVsAvatar" />
						</div>
					) : enemy && enemies[enemyIndex] ? (
						<>
							<img
								src={getendpoint("http", enemies[enemyIndex]?.avatar || "")}
								className="TournamentWarmUpVsAvatar"
							/>
							{/* <img src={badge} className="TournamentWarmUpVsBadge" /> */}
						</>
					) : (
						<>
							<img
								src={getendpoint("http", user?.avatar || "")}
								className="TournamentWarmUpVsAvatar"
							/>
							{/* <img src={badge} className="TournamentWarmUpVsBadge" /> */}
						</>
					)}
				</div>
				<div className="TournamentWarmUpVsPlayerInfo">
					{enemy ? (
						<>
							{enemies[enemyIndex] ? (
								<>
									<h4>{enemies[enemyIndex]?.username}</h4>
									<h4>{enemies[enemyIndex]?.stats.level} lvl</h4>
								</>
							) : isRandom ? (
								<h4>waiting ...</h4>
							) : (
								<h4>Invite a friend</h4>
							)}
							{/* {
                  isRandom
                    ?
                    (
                      enemyUser ?
                    )
                    :
                } */}
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

const ReadyContext = ({ isRandom = false }: PlayerCardData) => {
	const context = useContext(WarmUpContext);
	if (context) {
		let { socket, ready, setReady, setSocket, setEnemies, enemies } = context;

		const onReady = () => {
			if (ready) return;
			console.log("isRandom", isRandom);
			const newSocket = new WebSocket(
				getendpoint("ws", "/ws/game/tournament/random")
			);
			setSocket(newSocket);
			newSocket.onopen = () => {
				newSocket.send(
					JSON.stringify({
						event: "READY",
					})
				);
			};
			newSocket.onclose = () => {
				setReady(false);
				setEnemies([null, null, null]);
			};
			setReady(true);
		};
		const onAbort = () => {
			if (socket) {
				socket.send(
					JSON.stringify({
						event: "ABORT",
					})
				);
				socket.close();
				setSocket(null);
				setReady(false);
			}
		};
		return (
			<div className="WarmUpReadyContext">
				{/* <div className="WarmupReady"> */}
				<button className="WarmUpReadyBtn" onClick={onReady}>
					{ready ? "Wait" : "Ready"}
				</button>
				<button className="WarmUpAbortBtn" onClick={onAbort}>
					Abort
				</button>
				{/* </div> */}
			</div>
		);
	}
};

const TournamentWarmUp = ({ isRandom = false }: { isRandom?: boolean }) => {
	let [socket, setSocket] = useState<WebSocket | null>(null);
	const [ready, setReady] = useState<boolean>(false);
	const [enemies, setEnemies] = useState<EnemiesUserData>(emptyEnemies);
	const [user, setUser] = useState<userDataType | null | undefined>(null);

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
			value={{ socket, setSocket, enemies, setEnemies, ready, setReady, user }}
		>
			<div className="TournamentGameWarmUp">
				<h2>Warm Up</h2>
				<div className="TournamentWarmUpOther">
					<div className="TournamentWarmUpVs">
						<PlayerCard isRandom={isRandom} />
						<PlayerCard enemy enemyIndex={0} isRandom={isRandom} />
					</div>
					<div className="TournamentWarmUp TournamentVsOnly">
						<img src={vsImage} className="TournamentWarmUpVsImage" />
					</div>
					<div className="TournamentWarmUpVs">
						<PlayerCard enemy enemyIndex={1} isRandom={isRandom} />
						<PlayerCard enemy enemyIndex={2} isRandom={isRandom} />
					</div>
					<ReadyContext />
				</div>
			</div>
		</WarmUpContext.Provider>
	);
};

export default TournamentWarmUp;
