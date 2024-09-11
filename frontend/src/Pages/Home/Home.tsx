import  Search from './Components/Search'
import Icons from './Components/Icons'
import Welcome from './Components/Welcome'
import Profile from './Components/Profile'
import GameModes from './Components/GameModes'
import GameRank from './Components/GameRank'
import LastGame from './Components/LastGame'
import Chat from './Components/Chat'
import './Home.css'
import './styles/welcomeAndProfile.css'
import './styles/SearchAndIcons.css'

function Home() {
  return (
    <div className='homePage'>
      <div className='searchAndIcons'>
        <Search/>
        <Icons/>
      </div>
      <div className='welcome'>
        <Welcome/>
        <Profile/>
      </div>
      <div className='userInfo'>
        <div className='game'>
          <GameModes/>
          <div>
            <GameRank/>
            <LastGame/>
          </div>
        </div>
        <Chat/>
      </div>
    </div>
  )
}

export default Home
