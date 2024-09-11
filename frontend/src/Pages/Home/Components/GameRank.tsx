import '../styles/GameRank.css'
import photo from '../images/profile.svg'
import bg1 from '../images/badge1.svg'

function GameRank() {
  return (
    <div className='GameRank'>
      <h2>Game Rank</h2>
      <div className="Table">
        <div className="RowHeader">
            <div className="row">Rank</div>
            <div className="row">Badge</div>
            <div className="row">Player</div>
            <div className="row">Points</div>
            <div className="row">Level</div>
        </div>
        <div className='RowEle'>
          <div className='row'>1</div>
          <div className='row'>
            <img src={bg1} alt="" />
          </div>
          <div className='row'>
            <img src={photo} alt="" />
            <p>user1</p>
          </div>
          <div className='row'>
            <p>1425 xp</p>
          </div>
          <div className='row'> 5.22 </div>
        </div>
      </div>
    </div>
  )
}

export default GameRank
