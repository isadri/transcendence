import "./TournamentForm.css";

interface Props {
	players: string[];
}

const TournamentForm = ({players}: Props) => {
	return (
		<div className="tournament-list">
			<h2>Tournament Local</h2>
			<div className="tournament-players">
				<div className="first-two-match">
					<div className="tournament-match">
						<div>{players[0]}</div>
						<img src="/../Group.png" alt="" />
						<div>{players[1]}</div>
					</div>
					<div className="tournament-match">
						<div>{players[2]}</div>
						<img src="/../Group.png" alt="" />
						<div>{players[3]}</div>
					</div>
				</div>
				<div className="tournament-match">
					<div>{players[0]}</div>
					<img src="/../Group.png" alt="" />
					<div>{players[3]}</div>
				</div>
				<div className="tournament-match">
					<div>{players[0]}</div>
				</div>
			</div>
			<button className="start-btn">start</button>
		</div>
	);
};

export default TournamentForm;
