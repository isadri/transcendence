import { UserData } from '../Profile'
import '../styles/StatsProfile.css'

interface Prop{
  userData: UserData
}

function StatsProfile({userData}: Prop) {
  return (
    <div className='state-profile'>
        <h2>Stats</h2>
        <div className='statsProfile-content'>
          <div className='total'>
            <h4>Total Games</h4>
            <span>{userData.stats.nbr_games}</span>
          </div>
          <div className='wins'>
              <h4>Wins</h4>
            <span>{userData.stats.win}</span>
          </div>
          <div className='loss'>
            <h4>Loss</h4>
            <span>{userData.stats.lose}</span>
          </div>
        </div>
    </div>
  )
}

export default StatsProfile