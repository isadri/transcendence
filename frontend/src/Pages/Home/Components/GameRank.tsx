import "../styles/GameRank.css";
import photo from "../images/profile.svg";
import bg1 from "../images/badge1.svg";
import { useState } from "react";

function GameRank() {
  const [there_is_rank, setThere_is_rank] = useState(false)
  return (
    <div className="Home-GameRank">
      {
        there_is_rank &&
        <>
          <div className="Home-RowEle">
            <div className="Home-row1">
              <span>1</span>
              <img src={bg1} alt="" />
              <div className="Home-ProfileRev">
                <img src={photo} alt="" />
                <span>User1dfgdfgdfg</span>
              </div>
            </div>
            <div className="Home-row2">
              <span>1452 xp</span>
              <span>5.22 lvl</span>
            </div>
          </div>
          <div className="Home-RowEle">
            <div className="Home-row1">
              <span>1</span>
              <img src={bg1} alt="" />
              <div className="Home-ProfileRev">
                <img src={photo} alt="" />
                <span>User1dfgdfgdfg</span>
              </div>
            </div>
            <div className="Home-row2">
              <span>1452 xp</span>
              <span>5.22 lvl</span>
            </div>
          </div>
          <div className="Home-RowEle">
            <div className="Home-row1">
              <span>1</span>
              <img src={bg1} alt="" />
              <div className="Home-ProfileRev">
                <img src={photo} alt="" />
                <span>User1dfgdfgdfg</span>
              </div>
            </div>
            <div className="Home-row2">
              <span>1452 xp</span>
              <span>5.22 lvl</span>
            </div>
          </div>
        </>
      }
      {
        !there_is_rank &&
        <div className='Nostats game-NoStats'>
            <div className='stats-icon'>
            <i className="fa-solid fa-ranking-star"></i>
            </div>
            <div className='NoStats-msg'>
              <h3>No rankings available</h3>
              <span>No games have been played yet across all users</span>
            </div>
          </div>
      }
    </div>
  );
}

export default GameRank;
