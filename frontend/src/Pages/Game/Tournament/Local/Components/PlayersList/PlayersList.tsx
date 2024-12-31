import { useState } from "react";
import "./PlayersList.css";

interface Props {
	players: string[];
	setPlayers: React.Dispatch<React.SetStateAction<string[]>>;
	setStart: React.Dispatch<React.SetStateAction<boolean>>;
}

const PlayersList = ({ players, setPlayers, setStart }: Props) => {
	const [player, setPlayer] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
			addPlayers();
		}
	};

	const addPlayers = () => {
		if (player.length > 20) {
			setError("Player name most be less than 20 characters.");
			return;
		}
		if (players.length === 4) {
			setError("Most players is 4.");
			return;
		}
		if (!player.trim()) {
			setError("Player name cannot be empty.");
			return;
		}
		if (players.find((item) => item === player)) {
			setError("This player already exists.");
			return;
		}
		setPlayers([...players, player]);
		setPlayer("");
		setError(null);
	};

	const removePlayer = (value: string) => {
		setPlayers(players.filter((item) => item !== value));
		setPlayer("");
		setError(null);
	};

	return (
		<div className="Local-page-container">
			<div className="top-local-tournament">
				<i className="fa-solid fa-arrow-left arrow-local"></i>
				<h2 className="Local-page-title">Tournament Local</h2>
			</div>
			<div className="add-player-container">
				<input
					type="text"
					className="add-player"
					placeholder="Player name..."
					value={player}
					onChange={(event) => {
						setPlayer(event.target.value);
						setError(null);
					}}
					onKeyDown={handleKeyDown}
				/>
				<i className="fa-solid fa-floppy-disk save" onClick={addPlayers}></i>
			</div>
			{error && <div className="error-message">{error}</div>}
			<div className="players-container">
				{players.map((value) => (
					<div key={value}>
						{value}
						<i
							className="fa-solid fa-x remove"
							onClick={() => removePlayer(value)}
						></i>
					</div>
				))}
			</div>
			{players.length === 4 && (
				<button className="start-btn" onClick={() => setStart(true)}>
					start
				</button>
			)}
		</div>
	);
};

export default PlayersList;
