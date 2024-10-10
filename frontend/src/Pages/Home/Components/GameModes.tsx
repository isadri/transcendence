import '../styles/GameModes.css'
import FMode from '../images/friendsMode.svg'
import AMode from '../images/aiMode.svg'
import RMode from '../images/randomMode.svg'

function GameModes() {
  return (
    <div className='Home-GameModes'>
      <h2>Game Modes</h2>
      <div className='Home-GameContents'>
        <div className='Home-Mode'>
          <div>
              <h4>Random Mode</h4>
              <p>Start play with random person</p>
              <button type='submit'>Start</button>
          </div>
          <div>
              <img src={RMode} alt="" />
          </div>
        </div>
        <div className='Home-Mode'>
          <div>
              <h4>Ai Mode</h4>
              <p>Computer Challenge</p>
              <button type='submit'>Start</button>
          </div>
          <div>
            <img src={AMode} alt="" />
          </div>
        </div>
        <div className='Home-Mode'>
          <div>
              <h4>Friends Mode</h4>
              <p>start play with your friends</p>
              <button type='submit'>Start</button>
          </div>
          <div>
            <img src={FMode} alt="" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameModes
