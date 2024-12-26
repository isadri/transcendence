import "./TournamentForm.css";

const TournamentForm = () => {
	return (
		<div className="tournament-list">
			<h2>Tournament Local</h2>
			<div className="tournament-players">
				<div className="tournament-match">
					<div>player1</div>
					<img src="/../Group.png" alt="" />
					<div>player2</div>
				</div>
				<div className="tournament-match">
					<div>player3</div>
					<img src="/../Group.png" alt="" />
					<div>player4</div>
				</div>
				<div className="tournament-match">
					<div>player3</div>
					<img src="/../Group.png" alt="" />
					<div>player4</div>
				</div>
			</div>
		</div>
	);
};

export default TournamentForm;
