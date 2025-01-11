import { useEffect, useState } from "react";
import "./TournamentForm.css";
import Play from "../../../../Play/Play";
import TournamentGame from "../TournamentGame/TournamentGame";

interface GameFormProps {
	players: string[];
}

export interface TournamentPlayer {
	alias: string;
	score: number;
	avatar?: string;
}

export interface TournamentGameData {
	player1: TournamentPlayer;
	player2: TournamentPlayer;
	winner: TournamentPlayer | null;
}

export interface TournamentData {
	half1: TournamentGameData;
	half2: TournamentGameData;
	final: TournamentGameData | null;
	winner: TournamentPlayer | null;
}

interface TournamentGraghProps {
	data: TournamentData;
	setPlay: React.Dispatch<React.SetStateAction<boolean>>;
}

const TournamentGragh = ({ data, setPlay }: TournamentGraghProps) => {
	return (
		<div className="tournament-list">
			<h2>Tournament Local</h2>
			<div className="tournament-players">
				<div className="first-two-match">
					<TournamentGame game={data.half1} />
					<TournamentGame game={data.half2} />
				</div>

				<TournamentGame game={data.final} />
				<div className="tournament-match">
					<div>{data.winner ? data.winner.alias : "-"}</div>
				</div>
			</div>
			{
				!data.winner && !data.final?.winner &&
				<button
					className="start-btn"
					onClick={() => {
						setPlay(true);
					}}
				>
					start
				</button>}
		</div>
	);
};

function shufflePlayers(players: string[]) {
	for (let i = players.length - 1; i > 0; i--) {
		const randomIndex = Math.floor(Math.random() * (i + 1));
		[players[i], players[randomIndex]] = [players[randomIndex], players[i]];
	}
	return players;
}

function TournamentForm({ players }: GameFormProps) {
	const shuffled: string[] = shufflePlayers(players);
	const [play, setPlay] = useState<boolean>(false);
	const [data, setData] = useState<TournamentData>({
		half1: {
			player1: { alias: shuffled[0], score: 0 },
			player2: { alias: shuffled[1], score: 0 },
			winner: null,
		},
		half2: {
			player1: { alias: shuffled[2], score: 0 },
			player2: { alias: shuffled[3], score: 0 },
			winner: null,
		},
		final: null,
		winner: null,
	});
	const [game, setGame] = useState<TournamentGameData>(data.half1);

	useEffect(() => {
		if (!game) return;
		if (!data.half2.winner && game.winner) setGame(data.half2);
		else if (data.half1.winner && data.half2.winner) {
			const newgame: TournamentGameData = {
				player1: { alias: data.half1.winner.alias, score: 0 },
				player2: { alias: data.half2.winner.alias, score: 0 },
				winner: null,
			};
			setGame(newgame);
			setData({ ...data, final: newgame });
		}
		if (data.final && data.final.winner)
			setData({ ...data, winner: data.final.winner });
	}, [game?.winner]);

	return (
		<>
			{!play ? (
				<TournamentGragh data={data} setPlay={setPlay} />
			) : (
				<Play switcher={setPlay} game={game} setGame={setGame} />
			)}
		</>
	);
}

export default TournamentForm;
