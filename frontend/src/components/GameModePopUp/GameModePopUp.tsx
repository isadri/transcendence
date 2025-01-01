import "./GameModePopUp.css"
import TImage from "../../assets/cup.png"
import SImage from "../../Pages/Home/images/randomMode.svg"
import { useNavigate } from "react-router-dom";


interface GameModePopUpProps {
  mode: number;
  setter: React.Dispatch<React.SetStateAction<number>>;
}

function GameModePopUp({mode, setter}:GameModePopUpProps) {
  const navigator = useNavigate()


  const get1v1ModeLink = () => {
    if (mode === 1)
      navigator("/game/warmup/random")
    else if (mode === 2)
      navigator("/game/local")
    else if (mode === 3)
      navigator("/game/warmup/friends")
  }
  const get4v4ModeLink = () => {
    if (mode === 1)
      navigator("/game/tournament/remote/random")
    else if (mode === 2)
      navigator("/game/tournament/local")
    else if (mode === 3)
      navigator("/game/tournament/remote/friends")
  }
  return (
    <>
    <div className="GameModePopUpBlur">
      <div className="GameModePopUpBox">
        <i className="fa-solid fa-circle-xmark fa-2xl i-cross" 
        onClick={() => {setter(-1)}}>

        </i>
        <div className="GameModePopUpBoxTitle">
          <h2>Game modes</h2> 
        </div> 
        <div className="GameModePopUpGroup">
        <div className="GameModePopUpTournament" onClick={get4v4ModeLink}>
          <img src={TImage} />
          <h3>Tournament</h3>
        </div>
        <div className="GameModePopUp1vs1" onClick={get1v1ModeLink}>
          <img src={SImage} />
          <h3>1v1</h3>
        </div>
        </div>
      </div>
    </div>
    </>
  )
}
export default GameModePopUp;