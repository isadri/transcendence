import { getendpoint } from "../../../context/getContextData";


function Start(){
  const socket = new WebSocket(getendpoint("ws", "/ws/game/start/"))
  socket.onopen  = (e) => {
    console.log("open> ", e);
  }
  socket.onclose  = (e) => {
    console.log("close> ", e);
  }
  socket.onerror  = (e) => {
    console.log("error> ", e);
  }
  return (
    <>
    </>
  )
}

export default Start