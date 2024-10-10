import BadgesList from "./Components/BadgesList"
import ProfileUser from "./Components/ProfileUser"
import Friends from "./Components/friends"
import GameHestory from "./Components/GameHestory"
import LastAchievement from "./Components/LastAchievement"
import './Profile.css'


const Profile = () => {
  return (
    <div className="Home-Profile">
      <div className="Home-firstRaw">
        <ProfileUser/>
        <BadgesList/>
      </div>
      <div className="Home-SecondRaw">
        <div className="Home-AddRaw">
          <GameHestory/>
          <LastAchievement/>
        </div>
        <LastAchievement/>
        <Friends/>
      </div>
    </div>
  )
}

export default Profile
