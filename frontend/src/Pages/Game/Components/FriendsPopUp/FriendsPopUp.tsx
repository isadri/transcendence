import "../../../../components/GameModePopUp/GameModePopUp.css"
import "./FriendsPopUp.css"
import { userDataType } from "../../../../context/context";
import { getUser, getendpoint } from "../../../../context/getContextData";
import { useEffect, useState } from "react";
import axios from "axios";

interface FriendsPopUpData {
  setter: React.Dispatch<React.SetStateAction<boolean>>,
}

interface FriendItemData {
  friend: userDataType
}

function FriendItem({ friend }: FriendItemData) {
  return (
    <div className="friendItem" key={friend.id}>
      <div className="avatar_usernmae">
        <img src={friend.avatar} className="friendInviteAvatar" />
        <span>{friend.username}</span>
      </div>
      <span>7.5 lvl</span>
    </div>
  )
}



function FriendsPopUp({ setter }: FriendsPopUpData) {
  const user = getUser()
  const [friends, setFriends] = useState<userDataType[]>([])

  useEffect(() => {
    axios.get(getendpoint('http', '/api/friends/friends'))
    .then((response) => {
      console.log(response.data);
      setFriends(response.data.friends)
    })
  }, [])

  if (!user)
    return <></>
  return (
    <>
      <div className="GameModePopUpBlur" >
        <div className="GameFriendPopUpBox GameModePopUpBox">
          <i className="fa-solid fa-circle-xmark fa-2xl i-cross"
            onClick={() => { setter(false) }}>
          </i>
          <div className="GameFriendsInviteBoxTitle">
            <h2>invite Friend</h2>
          </div>
          <div className="GameFriendsInviteBox">
            <div className="FriendsSearch">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input type="search" placeholder="Search..." />
            </div>
            <div className="listFriends">
              {friends.length === 0 ? (
                <p>Loading...</p>
              ) : (
                friends.map((friend) => <FriendItem friend={friend}/>)
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default FriendsPopUp;


