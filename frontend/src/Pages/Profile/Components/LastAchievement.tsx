import '../styles/LastAchievement.css'
import img from '../images/badge1.svg'
import { UserData } from '../Profile'
import { useEffect, useState } from 'react'
import { getendpoint } from '../../../context/getContextData'
import axios from 'axios'
import win_achivement from '../images/achivements/win_achivement.svg'
import level_achivement from '../images/achivements/level_achivement.svg'
import milestone_achivement from '../images/achivements/milestone_achivement.svg'

interface Prop {
  userData: UserData
  username: string
}

interface AchievementDataType {
  id: number
  type: string
  name: string
  key: string
  text: string
}

function LastAchievement({ userData, username }: Prop) {
  const [Achievements, setAchievements] = useState<AchievementDataType[]>([])
  const getAchievements = () => {
    axios.get(getendpoint("http", `/api/game/userAchievement/${userData?.username}`))
      .then((response) => {
        setAchievements(response.data)
        console.log(response.data)
      })
      .catch((error) => {
        console.error("Error fetching friends list:", error);
      })
  }

  useEffect(() => {
    getAchievements()
  }, [])
  return (
    <div className='Home-LastAchievement'>
      <h2>Last Achievements</h2>
      <div className='Home-AchivementRows'>
        {
          Achievements.length !== 0 &&
          Achievements.map((achiv) => (
            <div key={achiv.id} className='Home-Achivement'>
              <div className='Home-AchivementImg'>
                {
                  achiv.type === 'level' &&
                  <img src={level_achivement} alt="" />
                }
                {
                  achiv.type === 'win' &&
                  <img src={win_achivement} alt="" />
                }
                {
                  achiv.type === 'game' &&
                  <img src={milestone_achivement} alt="" />
                }
              </div>
              <div className='Home-AchivementInfo'>
                <span>{achiv.name}</span>
                <span>{achiv.text}</span>
              </div>
            </div>
          ))
        }
        {
          Achievements.length === 0 &&
          (
            username === '' ?
            <div className='Nostats game-NoStatsprofile'>
              <div className='stats-icon stats-iconFriend'>
                <i className="fa-solid fa-trophy"></i>
              </div>
              <div className='NoStats-msg NoStats-msgProfile'>
                <h3>No achievements yet</h3>
                <span>You haven't unlocked any achievements so far.
                  Keep playing and completing challenges to earn achievements!</span>
              </div>
            </div>
            :
            <div className='Nostats game-NoStatsprofile'>
              <div className='stats-icon stats-iconFriend'>
                <i className="fa-solid fa-trophy"></i>
              </div>
              <div className='NoStats-msg NoStats-msgProfile'>
                <h3>No achievements yet</h3>
                <span>{userData.username} hasn't unlocked any achievements so far.</span>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default LastAchievement
