import '../styles/GameHestory.css'

function GameHestory() {
  return (
    <div className='GameHestory'>
      <h2>Game Hestory</h2>
      <div className='table'>
        {/* <div className='HeaderRow'>
          <span>Result</span>
          <span>Level xp</span>
          <span>Time</span>
        </div> */}
        <div className='tableRows'>
          <div className='rows win'>
            <span>Win</span>
            <div className='xp'>
              <span>50</span>
              <i className="fa-solid fa-arrow-up-long"></i>
            </div>
            <span>10 minute ago</span>
          </div>
          <div className='rows win'>
            <span>Win</span>
            <div className='xp'>
              <span>50</span>
              <i className="fa-solid fa-arrow-up-long"></i>
            </div>
            <span>10 minute ago</span>
          </div>
          <div className='rows Lose'>
            <span>Lose</span>
            <div className='xp'>
              <span>50</span>
              <i className="fa-solid fa-arrow-down-long"></i>
            </div>
            <span>10 minute ago</span>
          </div>
          <div className='rows Lose'>
            <span>Lose</span>
            <div className='xp'>
              <span>50</span>
              <i className="fa-solid fa-arrow-down-long"></i>
            </div>
            <span>10 minute ago</span>
          </div>
          <div className='rows win'>
            <span>Win</span>
            <div className='xp'>
              <span>50</span>
              <i className="fa-solid fa-arrow-up-long"></i>
            </div>
            <span>10 minute ago</span>
          </div>
          <div className='rows Lose'>
            <span>Lose</span>
            <div className='xp'>
              <span>50</span>
              <i className="fa-solid fa-arrow-down-long"></i>
            </div>
            <span>10 minute ago</span>
          </div>
          <div className='rows Lose'>
            <span>Lose</span>
            <div className='xp'>
              <span>50</span>
              <i className="fa-solid fa-arrow-down-long"></i>
            </div>
            <span>10 minute ago</span>
          </div>
          <div className='rows Lose'>
            <span>Lose</span>
            <div className='xp'>
              <span>50</span>
              <i className="fa-solid fa-arrow-down-long"></i>
            </div>
            <span>10 minute ago</span>
          </div>
          <div className='rows Lose'>
            <span>Lose</span>
            <div className='xp'>
              <span>50</span>
              <i className="fa-solid fa-arrow-down-long"></i>
            </div>
            <span>10 minute ago</span>
          </div>
          <div className='rows Lose'>
            <span>Lose</span>
            <div className='xp'>
              <span>50</span>
              <i className="fa-solid fa-arrow-down-long"></i>
            </div>
            <span>10 minute ago</span>
          </div>
          <div className='rows Lose'>
            <span>Lose</span>
            <div className='xp'>
              <span>50</span>
              <i className="fa-solid fa-arrow-down-long"></i>
            </div>
            <span>10 minute ago</span>
          </div>
          <div className='rows Lose'>
            <span>Lose</span>
            <div className='xp'>
              <span>150</span>
              <i className="fa-solid fa-arrow-down-long"></i>
            </div>
            <span>10 minute ago</span>
          </div>
          <div className='rows Lose'>
            <span>Lose</span>
            <div className='xp'>
              <span>50</span>
              <i className="fa-solid fa-arrow-down-long"></i>
            </div>
            <span>10 minute ago</span>
          </div>
          <div className='rows Lose'>
            <span>Lose</span>
            <div className='xp'>
              <span>50</span>
              <i className="fa-solid fa-arrow-down-long"></i>
            </div>
            <span>10 minute ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameHestory
