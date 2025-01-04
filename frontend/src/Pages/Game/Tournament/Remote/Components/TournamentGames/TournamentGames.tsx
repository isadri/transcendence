import { useEffect, useState } from "react";
import "./TournamentGames.css";
import axios from "axios";
import { getendpoint } from "../../../../../../context/getContextData";
import { FriendDataType } from "../../../../../../context/context";
import RemoteGame from "../RemoteGame/RemoteGame";

interface TournamentGamesProps {
  tournament: number
}

interface TournamentRemoteGameData {
  id: number,
  player1: number,
  player2: number,
  start_at: string,
  progress: string,
  p1_score: number,
  p2_score: number,
  winner: number | null,
}

interface TournamentRemoteData {
  id: number,
  winner: FriendDataType,
  player1: FriendDataType,
  player2: FriendDataType,
  player3: FriendDataType,
  player4: FriendDataType,
  half1: TournamentRemoteGameData,
  half2: TournamentRemoteGameData,
  final: TournamentRemoteGameData | null,
}

interface TournamentGraphProps {
  data: TournamentRemoteData;
}

const getGamePlayers: (game: string, data: TournamentRemoteData) => FriendDataType[] | null = (game, data) => {
  const getPlayerById = (id: number) => {
    if (data.player1.id === id)
      return data.player1
    else if (data.player2.id === id)
      return data.player2
    else if (data.player3.id === id)
      return data.player3
    else
      return data.player4
  }
  if (game === 'half1')
    return [getPlayerById(data.half1.player1), getPlayerById(data.half1.player2)]
  if (game === 'half2')
    return [getPlayerById(data.half2.player1), getPlayerById(data.half2.player2)]
  if (game === 'final' && data.final)
    return [getPlayerById(data.final.player1), getPlayerById(data.final.player2)]
  return null
}

const TournamentGraph = ({ data }: TournamentGraphProps) => {
  return (
    <div className="TournamentGames">
      <h2>Tournament Local</h2>
      <div className="tournament-players">
        <div className="first-two-match">
          <RemoteGame game={data.half1} players={getGamePlayers('half1', data)} />
          <RemoteGame game={data.half2} players={getGamePlayers('half2', data)} />
        </div>

        <RemoteGame game={data.final} players={getGamePlayers('final', data)} />
        <div className="tournament-match">
          <div>{data.winner ? data.winner.username : 'waiting'}</div>
        </div>
      </div>
      <button className="start-btn" onClick={() => { }}>start</button>
    </div>
  );
};

function TournamentGames({ tournament }: TournamentGamesProps) {
  const [data, setData] = useState<TournamentRemoteData | null>(null)

  console.log(data);
  
  useEffect(() => {
    if (!data) {
      axios.get(getendpoint("http", `/api/game/tournament/${tournament}`))
        .then((response) => {
          setData(response.data)
        })
    }
  }, [])
  return (
    <>
      {
        data ?
          <TournamentGraph data={data} /> :
          <>waiting</>
      }
    </>
  )
}

export type { TournamentRemoteGameData }
export default TournamentGames;