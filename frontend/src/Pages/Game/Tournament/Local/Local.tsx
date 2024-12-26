import { useState } from "react";
import PlayersList from "./Components/PlayersList";
import TournamentForm from "./Components/TournamentForm";
import "./Local.css";

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
