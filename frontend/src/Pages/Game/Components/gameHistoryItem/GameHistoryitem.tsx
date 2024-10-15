import "./GameHistoryitem.css"
import avatar from "../../images/avatar1.jpeg"
import vs from "../../../Home/images/Group.svg"
function GameHistoryitem() {
  return (
    <div className="GameHistoryItem">
      <div className="GameHistoryItemLeft">
        <img src={avatar}/>
        <span>user56789012345</span>
      </div>
      <div className="GameHistoryItemResult">
        <div> 1 </div>
        <img src={vs}/>
        <div> 1 </div>
      </div>
      <div className="GameHistoryItemRight">
        <span>user56789012345</span>
        <img src={avatar}/>
      </div>
    </div>
  );
}

export default GameHistoryitem;