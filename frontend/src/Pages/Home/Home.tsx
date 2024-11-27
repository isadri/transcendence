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
import { useContext } from 'react'
import { loginContext } from '../../App'

function Home() {
  const userContext = useContext(loginContext)
  if (userContext)
  {
    const  {user} = userContext
    console.log(user);
  }
  return (
    <div className='Home-homePage'>
      <div className='Home-searchAndIcons'>
        <Search/>
        <Icons/>
      </div>
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
          <div className='Home-gameStatis'>
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
