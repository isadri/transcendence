
import'../styles/friends.css'
import { FriendsData } from '../Profile'
import { useNavigate } from 'react-router-dom'
import { getendpoint } from '../../../context/getContextData'
interface Props{
  FriendsLst: FriendsData[],
  username: string
}

function friends({FriendsLst, username}: Props) {
  const navigate = useNavigate()
  return (
    <div className='Home-friendsProfile'>
      {
        username === '' ? ( <h2>Friends</h2>) : (<h2>Mutual Friends</h2>)
      }
      <div className='Home-title'>
        <i className="fa-solid fa-user-group"></i>
      </div>
      <div className='Home-FriensList' style={(FriendsLst.length === 0 ? {justifyContent: "Center"}:{})}>
      {
        FriendsLst.length > 0 ?  FriendsLst.map((friend) => (
          <div className='Home-friend' key={friend.id}>
            <div className="Home-friendInfo">
              <div className='img'>
                <img  src={getendpoint("http", friend.avatar)} alt={`${friend.username}'s avatar`}
                onClick={() => navigate(`/profile/${friend.username}`)}/>
                {
                  friend.is_online ?
                  <div className="onlineCircle-friend"></div>
                  :
                  <div className="onlineCircle-friend" style={{backgroundColor:'rgb(119 118 118)', borderColor:'rgb(119 118 118)'}}></div>
                }
              </div>
              <div className="Home-friendName">
                <span> {friend.username} </span>
                <span> level 10 </span>
              </div>
            </div>
            <div className='Home-friendProfile'>
             <button>Invite</button>
            </div>
          </div>
        )):
        (
          <>
            <div className='Home-noFriends'>
              <div className='NoFriends-icon'>
                <i className="fa-solid fa-users-slash"></i>
              </div>
              {
                username === '' ?
                  <div className='Content'>
                    <span className='title'>
                      No friends to show
                    </span>
                    <span className='paragraph'>
                      It looks like you haven't added any friends yet
                    </span>
                  </div>
                :
                  <div className='Content'>
                    <span className='title'>
                      No Mutual friends to show
                    </span>
                    <span className='paragraph'>
                      It looks like there are no mutual connections between you and this user
                    </span>
                  </div>
              }
            </div>
          </>
        )
      }
      </div>
    </div>
  )
}

export default friends

