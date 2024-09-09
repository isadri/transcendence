import  Search from './Components/Search'
import Icons from './Components/Icons'
import Welcome from './Components/Welcome'
import Profile from './Components/Profile'
import GameModes from './Components/GameModes'
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
      <GameModes/>
    </div>
  )
}

export default Home
