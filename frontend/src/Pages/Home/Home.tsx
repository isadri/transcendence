// import  Search from './Components/Search'
// import Icons from './Components/Icons'
import Welcome from './Components/Welcome'
import Profile from './Components/Profile'
import GameModes from './Components/GameModes'
import GameStats from './Components/GameStats'
import GameHighlights from './Components/gameHighlights'
import Chat from './Components/Chat'
import './Home.css'
import './styles/welcomeAndProfile.css'
import Alert from '../../components/Alert/Alert'
import { getContext } from '../../context/getContextData'

function Home() {
  const account = getContext()
  return (
    <>
      <div className='Home-homePage'>
        <div className='Home-welcome'>
          <Welcome/>
          <Profile/>
        </div>
        <div className='Home-userInfo'>
          <div className='Home-game'>
            <div className='Home-modeChat'>
              <GameModes/>
              <Chat/>
            </div>
            <div className='Home-gameStats'>
              <GameHighlights/>
              <GameStats/>
            </div>
          </div>
          <Chat/>
        </div>
      </div>
    </>
  )
}

export default Home
