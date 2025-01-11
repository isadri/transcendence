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
import {getUser, getendpoint } from '../../context/getContextData'
import Preloader from '../Preloader/Preloader'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { stats } from '../../context/context'

function Home() {
  const user = getUser();
	const [stats, setStats] = useState<stats>()
  useEffect(() => {
    axios.get(getendpoint("http", `/api/game/userStats/${user?.username}`))
      .then((response) => {
        setStats(response.data[0])
      })
      .catch(() => {
      })
    }, []);
  if (!stats)
      return <><Preloader/></>
  return (
    <>
      <div className='Home-homePage'>
        <div className='Home-welcome'>
          <Welcome />
          <Profile stats={stats}/>
        </div>
        <div className='Home-userInfo'>
          <div className='Home-game'>
            <div className='Home-modeChat'>
              <GameModes />
              <Chat />
            </div>
            <div className='Home-gameStats'>
              <GameHighlights />
              <GameStats stats={stats}/>
            </div>
          </div>
          <Chat />
        </div>
      </div>
    </>
  )
}

export default Home
