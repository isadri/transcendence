import './landing.css'
import NavBar from '../../components/FirstNavBar/navBar'

function landing() {
  return (
    <>
        <div className='landing'>
          <div className='landingCon'>
            <h1>welcome to our game </h1>
            <div className='paragraph'>
                <p>Are you ready to show off your ping pong skills? Play now and experience the ultimate table tennis game with realistic physics, thrilling gameplay, and endless competition!</p>
            </div>
            <button>Join Us</button>
          </div>
        </div>
    </>
  )
}

export default landing
