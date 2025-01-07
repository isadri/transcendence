
import '../styles/friends.css'
import { FriendsData } from '../Profile'
import { useNavigate } from 'react-router-dom'
import { getendpoint } from '../../../context/getContextData'
import { userData } from 'three/webgpu'
import axios from 'axios'
interface Props {
  FriendsLst: FriendsData[],
  username: string
}

function friends({ FriendsLst, username }: Props) {
  const navigate = useNavigate()

  const handleInvitePlay = (id: Number) => {
		axios
		.post(getendpoint("http", `/api/game/invite/`), { invited: id })
		.then((response) => {
			console.log("created ", response.data);

			navigate(`/game/warmup/friends/${response.data.id}`);
		})
		.catch((error) => {
			console.log(error.response.data);
		});
	};

  return (
    <div className='Home-friendsProfile'>
      {
        username === '' ? (<h2>Friends</h2>) : (<h2>Mutual Friends</h2>)
      }
      <div className='Home-title'>
        <i className="fa-solid fa-user-group"></i>
      </div>
      <div className='Home-FriensList' style={(FriendsLst.length === 0 ? { justifyContent: "Center" } : {})}>
        {
          FriendsLst.length > 0 ? FriendsLst.map((friend) => (
            <div className='Home-friend' key={friend.id}>
              <div className="Home-friendInfo">
                <div className='img'>
                  <img src={getendpoint("http", friend.avatar)} alt={`${friend.username}'s avatar`}
                    onClick={() => navigate(`/profile/${friend.username}`)} />
                  {
                    friend.is_online ?
                      <div className="onlineCircle-friend"></div>
                      :
                      <div className="onlineCircle-friend" style={{ backgroundColor: 'rgb(119 118 118)', borderColor: 'rgb(119 118 118)' }}></div>
                  }
                </div>
                <div className="Home-friendName">
                  <span> {friend.username} </span>
                  <span>level {friend.stats.level}</span>
                </div>
              </div>
              <div className='Home-friendProfile'>
                <button onClick={() => handleInvitePlay(friend.id)} >Invite</button>
              </div>
            </div>
          )) :
            (
              <>
                  {
                    username === '' ?
                      <div className='Nostats game-NoStats'>
                        <div className='stats-icon stats-iconFriend'>
                          <i className="fa-solid fa-users-slash"></i>
                        </div>
                        <div className='NoStats-msg'>
                          <h3>No friends to show</h3>
                          <span> It looks like you haven't added any friends yet</span>
                        </div>
                      </div>
                      :
                      <div className='Nostats game-NoStats'>
                        <div className='stats-icon stats-iconFriend'>
                          <i className="fa-solid fa-users-slash"></i>
                        </div>
                        <div className='NoStats-msg'>
                          <h3> No Mutual friends to show</h3>
                          <span>It looks like there are no mutual connections between you and {username}</span>
                        </div>
                      </div>
                  }
              </>
            )
        }
      </div>
    </div>
  )
}

export default friends

