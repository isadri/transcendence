import { useEffect, useRef, useState } from "react";
import "./TournamentGames.css";
import TournamentGame from "../../../Local/Components/TournamentGame/TournamentGame";
import { TournamentData } from "../../../Local/Components/TournamentForm/TournamentForm";
import axios from "axios";
import { getendpoint } from "../../../../../../context/getContextData";

interface TournamentGamesProps {
  tournament: number
}

interface TournamentGraghProps {
  data: TournamentData;
  setPlay?: React.Dispatch<React.SetStateAction<boolean>>;
}



const TournamentGragh = ({ data }: TournamentGraghProps) => {
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
          <div>{data.winner ? data.winner.alias : '-'}</div>
        </div>
      </div>
      <button className="start-btn" onClick={() => {  }}>start</button>
    </div>
  );
};

function TournamentGames({ tournament }: TournamentGamesProps) {
  // const [data, setData] = useState<TournamentData>({
  //   half1: {
  //     player1: { alias: shuffled[0], score: 0 },
  //     player2: { alias: shuffled[1], score: 0 },
  //     winner: null
  //   },
  //   half2: {
  //     player1: { alias: shuffled[2], score: 0 },
  //     player2: { alias: shuffled[3], score: 0 },
  //     winner: null
  //   },
  //   final: null,
  //   winner: null
  // })
  // const [game, setGame] = useState<TournamentGameData>(data.half1)


  // console.log("hello: ", data)
  // useEffect(() => {
  //   if (!game) return
  //   if (!data.half2.winner && game.winner)
  //     setGame(data.half2)
  //   else if (data.half1.winner && data.half2.winner) {
  //     const newgame: TournamentGameData = {
  //       player1: { alias: data.half1.winner.alias, score: 0 },
  //       player2: { alias: data.half2.winner.alias, score: 0 },
  //       winner: null
  //     }
  //     setGame(newgame)
  //     setData({ ...data, final: newgame })
  //   }
  //   if (data.final && data.final.winner)
  //     setData({ ...data, winner: data.final.winner })

  // }, [game?.winner])

  // useEffect(() => {
  //   axios.get(getendpoint("http", '/api/'))
  // })
  return (
    // <TournamentGragh data={data} />
    <>hello {tournament}</>
	)
}

export default TournamentGames;