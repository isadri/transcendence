import "../../../../components/GameModePopUp/GameModePopUp.css"
import "./FriendsPopUp.css"
import { userDataType } from "../../../../context/context";
import { getUser, getendpoint } from "../../../../context/getContextData";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { WarmUpContext } from "../../WarmUp/WarmUp";

interface FriendsPopUpData {
  setter: React.Dispatch<React.SetStateAction<boolean>>,
}





function FriendsPopUp({ setter }: FriendsPopUpData) {
  const user = getUser()
  const [friends, setFriends] = useState<userDataType[]>([])

  useEffect(() => {
    axios.get(getendpoint('http', '/api/friends/friends'))
      .then((response) => {
        setFriends(response.data.friends)
      })
  }, [])



  const warmUpContext = useContext(WarmUpContext)
  const onSelect = (friend:userDataType) => {
    if (warmUpContext) {
      const { setEnemyUser } = warmUpContext
      
      setEnemyUser(friend)
      setter(false)
    }
  }

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
                friends.map((friend) => {
                  return (
                    <div className="friendItem" key={friend.id} onClick={() => onSelect(friend)}>
                      <div className="avatar_usernmae">
                        <img src={getendpoint('http', friend.avatar)} className="friendInviteAvatar" />
                        <span>{friend.username}</span>
                      </div>
                      <span>7.5 lvl</span>
                    </div>
                  )
                }))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default FriendsPopUp;


