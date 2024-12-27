import "../../../../components/GameModePopUp/GameModePopUp.css"
import "./FriendsPopUp.css"

interface FriendsPopUpData {
  setter: React.Dispatch<React.SetStateAction<boolean>>,
}
function FriendsPopUp({ setter }: FriendsPopUpData) {

  return (
    <>
      <div className="GameModePopUpBlur">
        <div className="GameModePopUpBox">
          <i className="fa-solid fa-circle-xmark fa-2xl i-cross"
            onClick={() => { setter(false) }}>
          </i>
          <div className="GameModePopUpBoxTitle">
            <h2>invite Friend</h2>
          </div>
          <div className="GameFriendsInviteBox">
            <div className="FriendsSearch">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input type="search" placeholder="Search..." />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default FriendsPopUp;


