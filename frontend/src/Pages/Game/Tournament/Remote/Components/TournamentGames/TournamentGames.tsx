import { useEffect, useState } from "react";
import "./TournamentGames.css";
import axios from "axios";
import { getUser, getendpoint } from "../../../../../../context/getContextData";
import { FriendDataType, userDataType } from "../../../../../../context/context";
// import winImg from '../../../../Images/winnerImg.svg'
import winImg from '../../../../Images/crown.svg'
import RemoteGame from "../RemoteGame/RemoteGame";
import { useNavigate } from "react-router-dom";

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

function getMyGame(data: TournamentRemoteData, user: userDataType) {
  if (data.half1 && data.half1.progress === 'P' && (user?.id === data.half1.player1 || user?.id === data.half1.player2))
    return data.half1
  if (data.half2 && data.half2.progress === 'P' && (user?.id === data.half2.player1 || user?.id === data.half2.player2))
    return data.half2
  if (data.final && data.final.progress === 'P' && (user?.id === data.final.player1 || user?.id === data.final.player2))
    return data.final
  return null
}


const TournamentGraph = ({ data }: TournamentGraphProps) => {
  const user = getUser()
  const navigator = useNavigate()

  const playYourGame = () => {
    if (!user)
      return
    const myGame = getMyGame(data, user)
    console.log(myGame);

    if (myGame)
      navigator(`/game/remote/${myGame.id}`)
  }
  return (
    <div className="TournamentGames">
      <h2>Tournament Remote Online HD</h2>
      <div className="tournament-players">
        <div className="first-two-match">
          <RemoteGame type={"half"} game={data.half1} players={getGamePlayers('half1', data)} />
          <RemoteGame type={"half"} game={data.half2} players={getGamePlayers('half2', data)} />
        </div>

        <RemoteGame type={"final"} game={data.final} players={getGamePlayers('final', data)} />
        <div className="tournament-LastMatch">
          <div className="LastMatchContent">
            <div className="win">
              <img src={winImg} alt="Crown" />
            </div>
            <img className="img" src={data.winner ? getendpoint("http", data.winner.avatar) : ''} alt="" />
            {data.winner ? data.winner.username : 'waiting'}
            <div className="Winner">
              <span>Winner</span>
            </div>
          </div>
        </div>
      </div>
      <button className="start-btn" onClick={playYourGame}>Play</button>
    </div>
  );
};

function TournamentGames({ tournament }: TournamentGamesProps) {
  const [data, setData] = useState<TournamentRemoteData | null>(null)

  // console.log("tournament=> ", data);
  useEffect(() => {
    const socket = new WebSocket(getendpoint('ws', `/ws/game/tournament/${tournament}`))

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data)
      console.log("tournament=> ", data);
      setData(data)
    }
    socket.onopen = () => console.log("tournament socket opened")
    socket.onclose = () => console.log("tournament socket closed")
    socket.onerror = () => console.log("tournament socket error")
    return () => socket.close()
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

export type { TournamentRemoteGameData, TournamentRemoteData }
export default TournamentGames;