import '../styles/ProfileUser.css'
import { Link } from 'react-router-dom'
import { UserData } from '../Profile'
import { getendpoint, getUser } from '../../../context/getContextData'
import { useEffect, useState } from 'react'
import axios from 'axios'


interface Prop{
  userData: UserData
}

function ProfileUser({userData}:Prop) {
  const user = getUser()
  const [frindshipStatus, setfrindshipStatus] = useState("")
  useEffect(() => {
    axios.get(getendpoint('http', `/api/friends/friendship-status/${userData.id}`), {withCredentials:true})
    .then(response => {
      setfrindshipStatus(response.data.status)
      console.log(response.data.status)
    })
    .catch(error => {
      console.log("Error fetching user data:");
    });
  }, [userData.id]);
  const handleSendRequests = async (id: number) => {
			axios.post(getendpoint("http", "/api/friends/send/"),
				{ receiver: id },
				{withCredentials: true,}
			)
      .then( response => {
        console.log(response.data);
      })
      .catch (error => {
			console.error("Error accepting friend request:", error)})
	}
  const handleAcceptRequest = async (id: number) => {
		try {
			await axios.post(getendpoint("http", `/api/friends/accept/${id}`), null, {
				withCredentials: true,
			});
		} catch (error) {
			console.error("Error accepting friend request:", error);
		}
	};
  const handleDeleteRequests = async (id: number) => {
		try {
			await axios.delete(getendpoint("http", `/api/friends/decline/${id}`), {
				withCredentials: true,
			});
		} catch (error) {
			console.error("Error decline friend request:", error);
		}
	};
  return (
    <div className='Home-ProfileUser'>
      <div className='Home-ProfileElements'>
        <div className='Home-Btn'>
          <h2>Profile</h2>
          {
            user?.username === userData.username &&
            <div className='proBtn' >
              {/* <button type='submit'> */}
              <Link className="link" to='/Setting'>
                Edit
              </Link>
            </div>
          }
          {
            user?.username !== userData.username &&
            <>
            {
              frindshipStatus === "no_request" &&
              <div className='proBtn' >
                <button type='submit' onClick={() => {handleSendRequests(userData.id),
                  setfrindshipStatus("")} }><i className="fa-solid fa-user-plus"></i>Add friend</button>
              </div>
            }
            {
              frindshipStatus === "pending" &&
              <div className='proBtn' style={{ width: '30%' }}>
                <button type='submit' onClick={() => {handleAcceptRequest(userData.id),
                  setfrindshipStatus("accepted")}}><i className="fa-solid fa-user-check"></i>Confirm</button>
                <button type='submit' onClick={() => {handleDeleteRequests(userData.id)
                  setfrindshipStatus("no_request")}}><i className="fa-solid fa-xmark"></i>Delete</button>
              </div>
            }
            {
              //not handled yet
              frindshipStatus === "" && 
              <div className='proBtn'>
                <button type='submit'><i className="fa-solid fa-user-xmark"></i>Cancel request</button>
              </div>
            }
            {
              frindshipStatus === "accepted" &&
              <div className='proBtn'>
                <button type='submit'>Invite to Play</button>
              </div>
            }
            </>
          }
        </div>
        <div className='Home-ProfileContent'>
          <div className='Home-imgUser'>
            <div className="Home-img" >
              <img src={getendpoint("http",userData.avatar)} alt="" />
            </div>
            <div className='Home-UserName'>
              <span>{userData?.username}</span>
              <div className='Home-online'>
                <div className='Home-Circle'></div>
                <span>Online</span>
              </div>
            </div>
          </div>
          <div className='Home-ProfileLevel'>
            <div className='Home-XpClass'>
              <span>15000px / 12000xp </span>
            </div>
            <div className="Home-level-bar">
              <div className="Home-level-bar-fill"></div>
              <span className="Home-level-text">level 7 - 70%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileUser
