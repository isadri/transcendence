import '../styles/GameRank.css'
import photo from '../images/profile.svg'
import bg1 from '../images/badge1.svg'

function GameRank() {
  return (
    <div className='GameRank'>
      <h2>Game Rank</h2>
      <div className='RowEle'>
        <div className='row1'>
            <span>1</span>
            <img src={bg1} alt="" />
            <div className='ProfileRev'>
              <img src={photo} alt="" />
              <span>User1dfgdfgdfg</span>
            </div>
         </div>
      <div className='row2'>
            <span>1452 xp</span>
            <span>5.22 lvl</span>
         </div>
      </div>
      <div className='RowEle'>
         <div className='row1'>
            <span>1</span>
            <img src={bg1} alt="" />
            <div className='ProfileRev'>
              <img src={photo} alt="" />
              <span>User1dfgdfgdfg</span>
            </div>
         </div>
         <div className='row2'>
            <span>1452 xp</span>
            <span>5.22 lvl</span>
         </div>
      </div>
      <div className='RowEle'>
         <div className='row1'>
            <span>1</span>
            <img src={bg1} alt="" />
            <div className='ProfileRev'>
              <img src={photo} alt="" />
              <span>User1dfgdfgdfg</span>
            </div>
         </div>
         <div className='row2'>
            <span>1452 xp</span>
            <span>5.22 lvl</span>
         </div>
      </div>
      <div className='RowEle'>
         <div className='row1'>
            <span>1</span>
            <img src={bg1} alt="" />
            <div className='ProfileRev'>
              <img src={photo} alt="" />
              <span>User1dfgdfgdfg</span>
            </div>
         </div>
         <div className='row2'>
            <span>1452 xp</span>
            <span>5.22 lvl</span>
         </div>
      </div>
      <div className='RowEle'>
         <div className='row1'>
            <span>1</span>
            <img src={bg1} alt="" />
            <div className='ProfileRev'>
              <img src={photo} alt="" />
              <span>User1dfgdfgdfg</span>
            </div>
         </div>
         <div className='row2'>
            <span>1452 xp</span>
            <span>5.22 lvl</span>
         </div>
      </div>
    </div>
  )
}

export default GameRank
