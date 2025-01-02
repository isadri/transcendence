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
import friends from "./Components/friends"

interface FriendsData{
  id : number,
  username: string,
  avatar : string
  is_online: boolean,
  is_blocked: boolean,
  stats: stats
}

interface stats{
  level: number,
  badge: number,
  win: number,
  lose: number,
  nbr_games: number
}

interface UserData {
  id: number,
  username: string,
  email: string,
  avatar: string,
  is_online: boolean,
  is_blocked: boolean,
  stats: stats
}


const Profile = () => {
  const user = getUser()
  const {username} = useParams()
  const [userData, setUserData] = useState<UserData | null>(null);
  const [FriendsLst, setFriendsLst] = useState<FriendsData[] | null>([]);

  useEffect(() => {
    if (username) {
      axios.get(getendpoint('http', `/api/accounts/user/${username}`), {withCredentials:true})
        .then(response => {
          setUserData(response.data);
        })
        .catch(error => {
          console.log("Error fetching user data:");
        });
      axios.get(getendpoint('http', `/api/friends/MutualFriendsView/${username}`), {withCredentials:true})
        .then(response =>{
          setFriendsLst(response.data)
          console.log("mutual friends===> ", response.data)
        })
        .catch(error => {
          console.log("Error fetching user data:");
        });
    }
    else{
      if (user)
      {
        setUserData({...user, is_blocked: false});
        axios.get(getendpoint("http", "/api/friends/friends"),{withCredentials:true})
          .then((response) =>{
            setFriendsLst(response.data.friends)
          })
          .catch ((error) =>{
            console.error("Error fetching friends list:", error);
          })
      }
    }
  }, [username]);

  return (
    <div className="Home-Profile">
      <div className="Home-firstRaw">
        {userData && <ProfileUser userData={userData}/>}
        <BadgesList/>
      </div>
      <div className="Home-SecondRaw">
        <div className="Home-AddRaw">
          <GameHestory/>
          <LastAchievement/>
        </div>
        <LastAchievement/>
        {FriendsLst && <Friends FriendsLst={FriendsLst} username={username || ''}/>}
      </div>
    </div>
  )
}

export type {UserData}
export type {FriendsData}

export default Profile
