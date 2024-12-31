import { useState } from "react";
import TournamentForm from "./Components/TournamentForm/TournamentForm";
import "./Local.css";
import PlayersList from "./Components/PlayersList/PlayersList";

const Local = () => {
	const [players, setPlayers] = useState<string[]>([]);
	const [start, setStart] = useState(false);
	return (
		<>
			{!start ? (
				<PlayersList players={players} setPlayers={setPlayers} setStart={setStart} />
			) : (
				<TournamentForm players={players} />
			)}
		</>
	);
};

export default Local;
