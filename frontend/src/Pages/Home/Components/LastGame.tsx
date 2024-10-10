import '../styles/LastGame.css'
import photo from '../images/profile.svg'
import Group from '../images/Group.svg'

function LastGame() {
  return (
    <div className='Home-LastGame'>
      <h2>Last Game</h2>
      <div className='Home-RowEle'>
        <div className='Home-Row1'>
            <img src={photo} alt="" />
            <span>user1kkkkkkkkkk</span>
        </div>
        <div>
        <div className='Home-Row2'>
          <span className='Home-score1'>1</span>
          <img src={Group} alt="" />
          <span className='Home-score2'>1</span>
        </div>
        </div>
        <div className='Home-Row3'>
            <span>user2hhhhhhhhhh</span>
            <img src={photo} alt="" />
        </div>
      </div>
      <div className='Home-RowEle'>
        <div className='Home-Row1'>
            <img src={photo} alt="" />
            <span>user1</span>
        </div>
        <div>
        <div className='Home-Row2'>
          <span className='Home-score1'>1</span>
          <img src={Group} alt="" />
          <span className='Home-score2'>1</span>
        </div>
        </div>
        <div className='Home-Row3'>
            <span>user2</span>
            <img src={photo} alt="" />
        </div>
      </div>
      <div className='Home-RowEle'>
        <div className='Home-Row1'>
            <img src={photo} alt="" />
            <span>user1</span>
        </div>
        <div>
        <div className='Home-Row2'>
          <span className='Home-score1'>1</span>
          <img src={Group} alt="" />
          <span className='Home-score2'>1</span>
        </div>
        </div>
        <div className='Home-Row3'>
            <span>user2</span>
            <img src={photo} alt="" />
        </div>
      </div>
      <div className='Home-RowEle'>
        <div className='Home-Row1'>
            <img src={photo} alt="" />
            <span>user1</span>
        </div>
        <div>
        <div className='Home-Row2'>
          <span className='Home-score1'>1</span>
          <img src={Group} alt="" />
          <span className='Home-score2'>1</span>
        </div>
        </div>
        <div className='Home-Row3'>
            <span>user2</span>
            <img src={photo} alt="" />
        </div>
      </div>
      <div className='Home-RowEle'>
        <div className='Home-Row1'>
            <img src={photo} alt="" />
            <span>user1</span>
        </div>
        <div>
        <div className='Home-Row2'>
          <span className='Home-score1'>1</span>
          <img src={Group} alt="" />
          <span className='Home-score2'>1</span>
        </div>
        </div>
        <div className='Home-Row3'>
            <span>user2</span>
            <img src={photo} alt="" />
        </div>
      </div>
    </div>
  )
}

export default LastGame
