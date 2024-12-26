import "./PlayersList.css";

const PlayersList = () => {
	return (
		<div className="Local-page-container">
			<div className="top-local-tournament">
				<i className="fa-solid fa-arrow-left arrow-local"></i>
				<h2 className="Local-page-title">Tournament Local</h2>
			</div>
			<div className="add-player-container">
				<input type="text" className="add-player" placeholder="Player name..." />
				<i className="fa-solid fa-floppy-disk save"></i>
			</div>
			<div className="players-container">
				<div>jjj<i className="fa-solid fa-x remove"></i> </div>
				<div></div>
				<div></div>
				<div></div>
			</div>
			<button className="start-btn">start</button>
		</div>
	);
};

export default PlayersList;
