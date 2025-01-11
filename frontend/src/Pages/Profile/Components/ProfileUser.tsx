import '../styles/ProfileUser.css'
import { Link, useNavigate } from 'react-router-dom'
import { UserData } from '../Profile'
import { getContext, getendpoint, getUser } from '../../../context/getContextData'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { stats } from '../../../context/context'


interface Prop{
  userData: UserData
  username: string
  stats: stats
}

function ProfileUser({userData, stats}:Prop) {
  const [frindshipStatus, setfrindshipStatus] = useState("")
  const [isOnline, setIsOnline] = useState<boolean>(userData?.is_online || false)
  // const [stats, setStats] = useState<stats>()
  const user = getUser()
  const navigate = useNavigate();
  const cntxt = getContext()
  useEffect(() => {
    axios.get(getendpoint('http', `/api/friends/friendship-status/${userData.id}`), {withCredentials:true})
    .then(response => {
      setfrindshipStatus(response.data.status)
    })
    .catch(() => {
    });
    setIsOnline(userData?.is_online || false)
  }, [userData.id, userData?.is_online]);




  const handleSendRequests = async (id: number) => {
			axios.post(getendpoint("http", "/api/friends/send/"),
				{ receiver: id },
				{withCredentials: true,}
			)
      .then( () => {
      })
      .catch (() => {
    })
	}
  const handleAcceptRequest = async (id: number) => {
		try {
			await axios.post(getendpoint("http", `/api/friends/accept/${id}`), null, {
				withCredentials: true,
			});
		} catch (error) {
		}
	};
  const handleDeleteRequests = async (id: number) => {
		try {
			await axios.delete(getendpoint("http", `/api/friends/decline/${id}`), {
				withCredentials: true,
			});
		} catch (error) {
		}
	};

  const handleCancelRequests = async (id: number) => {
		try {
			await axios
				.delete(getendpoint("http", `/api/friends/cancel/${id}`), {
					withCredentials: true,
				})
		} catch (error) {
		}
	};

  const handleUnblockRequests = async (id: number) => {
		try {
			await axios
				.post(getendpoint("http", `/api/friends/unblock/${id}`), null, {
					withCredentials: true,
				})
		} catch (error) {
		}
	};
  var percentage = 0
  if (stats)
   percentage = stats.xp * 100 / ((stats.level + 1) * 100);

  const handleInvitePlay = (id: Number) => {
		axios
		.post(getendpoint("http", `/api/game/invite/`), { invited: id })
		.then((response) => {
			navigate(`/game/warmup/friends/${response.data.id}`);
		})
		.catch((error) => {
      cntxt?.setCreatedAlert(error.response.data.error)
      cntxt?.setDisplayed(3)
		});
	};
  return (
    <div className='Home-ProfileUser'>
    <div className='Home-ProfileElements'>
      <div className='Home-Btn'>
        <h2>Profile</h2>
        {
          user?.username === userData.username &&
          <div className='proBtn' >
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
                setfrindshipStatus("cancel")} }><i className="fa-solid fa-user-plus"></i>Add friend</button>
            </div>
          }
          {
            frindshipStatus === "blocked" && userData.is_blocked === "blocker" &&
            <div className='proBtn' >
              <button type='submit' onClick={() => {handleUnblockRequests(userData.id),
                setfrindshipStatus("no_request"),
                userData.is_blocked === false}}>Unblock</button>
            </div>
          }
          {
            frindshipStatus === "pending" &&
            <div className='proBtn' style={{ width: '40%'}}>
              <button type='submit' onClick={() => {handleAcceptRequest(userData.id),
                setfrindshipStatus("accepted")}}><i className="fa-solid fa-user-check"></i>Confirm</button>
              <button type='submit' onClick={() => {handleDeleteRequests(userData.id)
                setfrindshipStatus("no_request")}}><i className="fa-solid fa-xmark"></i>Delete</button>
            </div>
          }
          {
            frindshipStatus === "cancel" &&
            <div className='proBtn'>
              <button type='submit' onClick={() => {handleCancelRequests(userData.id),
                setfrindshipStatus("no_request")}}><i className="fa-solid fa-user-xmark"></i>Cancel request</button>
            </div>
          }
          {
            frindshipStatus === "accepted" &&
            <div className='proBtn'>
              <button type='submit' onClick={() => handleInvitePlay(userData.id)} >Invite to Play</button>
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
            {
             user?.username === userData.username && isOnline && 
              <div className='Home-online'>
                <div className='Home-Circle'></div>
                <span>Online</span>
              </div>
            }
            {
             user?.username !== userData.username && userData.is_online && 
              <div className='Home-online'>
                <div className='Home-Circle'></div>
                <span>Online</span>
              </div>
            }
            {
             user?.username !== userData.username && !userData.is_online &&
              <div className='Home-online'>
                <div className='Home-Circle' style={{backgroundColor: "rgb(119 118 118)", borderColor:"rgb(119 118 118)"}}></div>
                <span style={{color: "rgb(119 118 118)"}}>Offline</span>
              </div>

            }
          </div>
        </div>
        <div className='Home-ProfileLevel'>
          <div className='Home-XpClass'>
            <span>{stats.xp}xp / {(stats.level + 1)*100}xp </span>
          </div>
          <div className="Home-level-bar">
            <div className="Home-level-bar-fill" style={{ width: `${percentage}%` }}></div>
            <span className="Home-level-text">Level {stats && Math.floor(stats.level)} - {Math.round(percentage)}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default ProfileUser
