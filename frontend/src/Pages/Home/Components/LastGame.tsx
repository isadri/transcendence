import "../styles/LastGame.css";
import photo from "../images/profile.svg";
import Group from "../images/Group.svg";
import { useState } from "react";

function LastGame() {
  const [there_is_rank, setThere_is_rank] = useState(false) 

  return (
    <div className="Home-LastGame">
      {
        there_is_rank &&
        <>
          <div className="Home-RowEle">
            <div className="Home-Row1">
              <img src={photo} alt="" />
              <span>user1kkkkkkkkkk</span>
            </div>
            <div>
              <div className="Home-Row2">
                <span className="Home-score1">1</span>
                <img src={Group} alt="" />
                <span className="Home-score2">1</span>
              </div>
            </div>
            <div className="Home-Row3">
              <span>user2hhhhhhhhhh</span>
              <img src={photo} alt="" />
            </div>
          </div>
          <div className="Home-RowEle">
            <div className="Home-Row1">
              <img src={photo} alt="" />
              <span>user1</span>
            </div>
            <div>
              <div className="Home-Row2">
                <span className="Home-score1">1</span>
                <img src={Group} alt="" />
                <span className="Home-score2">1</span>
              </div>
            </div>
            <div className="Home-Row3">
              <span>user2</span>
              <img src={photo} alt="" />
            </div>
          </div>
          <div className="Home-RowEle">
            <div className="Home-Row1">
              <img src={photo} alt="" />
              <span>user1</span>
            </div>
            <div>
              <div className="Home-Row2">
                <span className="Home-score1">1</span>
                <img src={Group} alt="" />
                <span className="Home-score2">1</span>
              </div>
            </div>
            <div className="Home-Row3">
              <span>user2</span>
              <img src={photo} alt="" />
            </div>
          </div>
          <div className="Home-RowEle">
            <div className="Home-Row1">
              <img src={photo} alt="" />
              <span>user1</span>
            </div>
            <div>
              <div className="Home-Row2">
                <span className="Home-score1">1</span>
                <img src={Group} alt="" />
                <span className="Home-score2">1</span>
              </div>
            </div>
            <div className="Home-Row3">
              <span>user2</span>
              <img src={photo} alt="" />
            </div>
          </div>
          <div className="Home-RowEle">
            <div className="Home-Row1">
              <img src={photo} alt="" />
              <span>user1</span>
            </div>
            <div>
              <div className="Home-Row2">
                <span className="Home-score1">1</span>
                <img src={Group} alt="" />
                <span className="Home-score2">1</span>
              </div>
            </div>
            <div className="Home-Row3">
              <span>user2</span>
              <img src={photo} alt="" />
            </div>
          </div>
        </>
      }
      {
         !there_is_rank &&
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
  );
}

export default LastGame;
