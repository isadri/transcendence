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
  return (
    <>
    <div className="GameModePopUpBlur">
      <div className="GameModePopUpBox">
        <i className="fa-solid fa-circle-xmark fa-2xl" 
        onClick={() => {setter(-1)}}>

        </i>
        <div className="GameModePopUpBoxTitle">
          <h2>Game modes</h2>
        </div> 
        <div className="GameModePopUpGroup">
        <div className="GameModePopUpTournament">
          <img src={TImage} />
          <h3>Tournament</h3>
        </div>
        <div className="GameModePopUp1vs1" onClick={() => navigator("/game/warmup")}>
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