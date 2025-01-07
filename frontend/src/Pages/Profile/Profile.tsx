import BadgesList from "./Components/BadgesList"
import ProfileUser from "./Components/ProfileUser"
import Friends from "./Components/friends"
import GameHestory from "./Components/GameHestory"
import LastAchievement from "./Components/LastAchievement"
import StatsProfile from "./Components/StatsProfile"
import { useParams } from 'react-router-dom';
import axios from 'axios'
import './Profile.css'
import { useEffect, useState } from "react"
import { getendpoint, getUser } from "../../context/getContextData"
import { stats } from '../../../src/context/context'


interface FriendsData{
  id : number,
  username: string,
  avatar : string
  is_online: boolean,
  is_blocked: boolean,
  stats: stats
}

// interface state{
//   level: number,
//   badge: number,
//   win: number,
//   lose: number,
//   nbr_games: number
//   xp: number
// }

interface UserData {
  id: number,
  username: string,
  email: string,
  avatar: string,
  is_online: boolean,
  is_blocked: boolean,
  // stats: state
}


const Profile = () => {
  const user = getUser()
  const {username} = useParams()
  const [userData, setUserData] = useState<UserData | null>(null);
  const [FriendsLst, setFriendsLst] = useState<FriendsData[] | null>([]);
  const [stats, setStats] = useState<stats>()


  
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
      
      useEffect(() => {
        // var user_stat = username === undefined ? user?.username : username
        var user_stat = username
        if (username === undefined)
          user_stat = user?.username
        axios.get(getendpoint("http", `/api/game/userStats/${user_stat}`))
        .then((response) => {
          setStats(response.data[0])
          console.log(response.data[0])
        })
        .catch((error) => {
          console.log("error==================>",error)
        })
      }, []);
      if (!userData)
      return
      if (!stats)
        return
  return (
    <div className="Home-Profile">
      <div className="Home-firstRaw">
        <ProfileUser userData={userData} stats={stats} username={username || ''}/>
        <BadgesList  stats={stats} />
      </div>
      <div className="Home-SecondRaw">
        <div className="Home-AddRaw">
          <StatsProfile stats={stats}/>
          <GameHestory userData={userData} username={username || ''}/>
          <LastAchievement userData={userData} username={username || ''}/>
        </div>
        <LastAchievement userData={userData} username={username || ''}/>
        <div className="stats-friends">
          <StatsProfile stats={stats}/>
          {FriendsLst && <Friends FriendsLst={FriendsLst} username={username || ''}/>}
        </div>
      </div>
    </div>
  )
}

export type {UserData}
export type {FriendsData}

export default Profile
