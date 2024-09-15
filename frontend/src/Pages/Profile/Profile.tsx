import BadgesList from "./Components/BadgesList"
import ProfileUser from "./Components/ProfileUser"
import Friends from "./Components/friends"
import GameHestory from "./Components/GameHestory"
import LastAchievement from "./Components/LastAchievement"
import './Profile.css'


const Profile = () => {
  return (
    <div className="Profile">
      <div className="firstRaw">
        <ProfileUser/>
        <BadgesList/>
      </div>
      <div className="SecondRaw">
        <GameHestory/>
        <LastAchievement/>
        <Friends/>
      </div>
    </div>
  )
}

export default Profile