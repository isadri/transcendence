import { useState } from "react";
import Game from "../../../Game";
import "./TournamentForm.css";

interface GameFormProps {
	players: string[];
}

export interface TournamentPlayer {
	alias: string,
	score: number,
}

export interface TournamentGameData {
	player1: TournamentPlayer,
	player2: TournamentPlayer,
	winner: TournamentPlayer | null
}

export interface TournamentData {
	half1: TournamentGameData,
	half2: TournamentGameData,
	final: TournamentGameData | null,
	winner: TournamentPlayer | null
}

interface TournamentGraghProps {
	data: TournamentData;
	setData: React.Dispatch<React.SetStateAction<TournamentData>>;
}



const TournamentGragh = ({ data, setData }: TournamentGraghProps) => {
	return (
		<div className="tournament-list">
			<h2>Tournament Local</h2>
			<div className="tournament-players">
				<div className="first-two-match">
					<div className="tournament-match">
						<div>{data.half1.player1.alias}</div>
						<img src="/../Group.png" alt="" />
						<div>{data.half1.player2.alias}</div>
					</div>
					<div className="tournament-match">
						<div>{data.half2.player1.alias}</div>
						<img src="/../Group.png" alt="" />
						<div>{data.half2.player2.alias}</div>
					</div>
				</div>
				<div className="tournament-match">
					<div>{data.final ? data.final.player1.alias : '-'}</div>
					<img src="/../Group.png" alt="" />
					<div>{data.final ? data.final.player2.alias : '-'}</div>
				</div>
				<div className="tournament-match">
					<div>{data.winner ? data.winner.alias : '-'}</div>
				</div>
			</div>
			<button className="start-btn">start</button>
		</div>
	);
};

function shufflePlayers(players:string[]) {
	for (let i = players.length - 1; i > 0; i--) {
			const randomIndex = Math.floor(Math.random() * (i + 1));
			[players[i], players[randomIndex]] = [players[randomIndex], players[i]];
	}
	return players;
}


function TournamentForm({ players }: GameFormProps) {
	const shuffled: string[] = shufflePlayers(players)
	const [data, setData] = useState<TournamentData>({
		half1: {
			player1: { alias: shuffled[0], score: 0 },
			player2: { alias: shuffled[1], score: 0 },
			winner: null
		},
		half2: {
			player1: { alias: shuffled[2], score: 0 },
			player2: { alias: shuffled[3], score: 0 },
			winner: null
		},
	 final: null,
	 winner: null
	})

	console.log(players);


	console.log(shuffled);

	return (
		<>
			{true ?
				<TournamentGragh data={data} setData={setData} players={players} />
				:
				<Game />
			}
		</>
	)
}

export default TournamentForm;
