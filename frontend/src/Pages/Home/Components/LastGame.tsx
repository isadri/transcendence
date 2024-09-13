import '../styles/LastGame.css'
import photo from '../images/profile.svg'
import Group from '../images/Group.svg'

function LastGame() {
  return (
    <div className='LastGame'>
      <h2>Last Game</h2>
      <div className='RowEle'>
        <div className='Row1'>
            <img src={photo} alt="" />
            <span>user1</span>
        </div>
        <div>
        <div className='Row2'>
          <span className='score1'>1</span>
          <img src={Group} alt="" />
          <span className='score2'>1</span>
        </div>
        </div>
        <div className='Row3'>
            <span>user2</span>
            <img src={photo} alt="" />
        </div>
      </div>
      <div className='RowEle'>
        <div className='Row1'>
            <img src={photo} alt="" />
            <span>user1</span>
        </div>
        <div>
        <div className='Row2'>
          <span className='score1'>1</span>
          <img src={Group} alt="" />
          <span className='score2'>1</span>
        </div>
        </div>
        <div className='Row3'>
            <span>user2</span>
            <img src={photo} alt="" />
        </div>
      </div>
      <div className='RowEle'>
        <div className='Row1'>
            <img src={photo} alt="" />
            <span>user1</span>
        </div>
        <div>
        <div className='Row2'>
          <span className='score1'>1</span>
          <img src={Group} alt="" />
          <span className='score2'>1</span>
        </div>
        </div>
        <div className='Row3'>
            <span>user2</span>
            <img src={photo} alt="" />
        </div>
      </div>
      <div className='RowEle'>
        <div className='Row1'>
            <img src={photo} alt="" />
            <span>user1</span>
        </div>
        <div>
        <div className='Row2'>
          <span className='score1'>1</span>
          <img src={Group} alt="" />
          <span className='score2'>1</span>
        </div>
        </div>
        <div className='Row3'>
            <span>user2</span>
            <img src={photo} alt="" />
        </div>
      </div>
    </div>
  )
}

export default LastGame
