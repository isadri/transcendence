import BadgesList from "./Components/BadgesList"
import ProfileUser from "./Components/ProfileUser"
import Friends from "./Components/friends"
import GameHestory from "./Components/GameHestory"
import LastAchievement from "./Components/LastAchievement"
import { useParams } from 'react-router-dom';
import axios from 'axios'
import './Profile.css'
import { useEffect, useState } from "react"
import { getendpoint, getUser } from "../../context/getContextData"

interface UserData {
  id: number;
  username: string;
  email: string;
  avatar: string;
}

const Profile = () => {
  const user = getUser()
  const {username} = useParams()
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (username) {
      axios.get(getendpoint('http', `/api/accounts/user/${username}`), {withCredentials:true})
        .then(response => {
          setUserData(response.data);
        })
        .catch(error => {
          console.log("Error fetching user data:");
        });
    }
    else{
      if (user)
        setUserData(user)
    }
  }, [username]);

  if(userData)
  {
    return (
      <div className="Home-Profile">
        <div className="Home-firstRaw">
          <ProfileUser userData={userData}/>
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
}

export type {UserData}

export default Profile
