import '../styles/GameHestory.css'
import { UserData } from '../Profile'
import { FriendDataType } from "../../../context/context";
import { useEffect, useState } from 'react';
import {  getendpoint } from '../../../context/getContextData';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';

interface Prop{
  userData: UserData
}

interface GameDataType{
  id: number,
  player1: FriendDataType,
  player2: FriendDataType,
  start_at: string,
  p1_score: number,
  p2_score: number,
  winner: number
}

function GameHestory({userData}: Prop) {
  const [userGames, setUserGames] = useState<GameDataType[]>([])
  const GetUserGames = () =>{
    axios.get(getendpoint("http", `/api/game/History/${userData?.username}`))
      .then((response) =>{
        setUserGames(response.data)
        console.log(response.data)
      })
      .catch ((error) =>{
        console.error("Error fetching friends list:", error);
      })
  }

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "now";
    }
    return formatDistanceToNow(date, {
      addSuffix: true,
    });
  };

  useEffect(() => {
    GetUserGames()
  }, [])

  return (
    <div className='Home-GameHestory'>
      <h2>Game Hestory</h2>
        <div className='Home-tableRows'>
          {
            userGames.length !== 0 &&
            userGames.map((userStats) => (
              <div className='Home-rows Home-win'>
                <span 
                  style={userStats.winner === userData.id ? {color:'#00ff00'}: {color:'#ff0000'}}>
                  {userStats.winner === userData.id ? 'win' : 'lose'}</span>
                <div className='Home-xp'>
                  <span
                  style={userStats.winner === userData.id ? {color:'#00ff00'}: {color:'#ff0000'}}>50</span>
                  {
                    userStats.winner === userData.id &&
                    <i className="fa-solid fa-arrow-up-long"></i>
                  }
                  {
                    userStats.winner !== userData.id &&
                    <i className="fa-solid fa-arrow-down-long"></i>
                  }
                </div>
                {/* <span>{userStats.start_at}</span> */}
                <div className='time-game'>
                  <span>
                    {getRelativeTime(userStats.start_at)}
                  </span>
                </div>
              </div>
            ))
          }
          {
            userGames.length === 0 &&
            <div className='Nostats game-NoStats'>
            <div className='stats-icon'>
            <i className="fa-solid fa-table-tennis-paddle-ball"></i>
            </div>
            <div className='NoStats-msg'>
              <h3>No games played yet</h3>
              <span>You haven't played any games so far.
               Once you start playing,
               your game history will appear here!</span>
            </div>
          </div>
          }
        </div>
      {/* </div> */}
    </div>
  )
}

export default GameHestory
