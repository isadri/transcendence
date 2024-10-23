import "./navBar.css";
import { Link } from "react-router-dom";

function responsiveBar() {
  return (
    <div className='resBar'>
        <ul >
          <li><Link to="/landing">Home</Link></li>
          <li><Link to="/aboutUs">AboutUs</Link></li>
          <li><Link to="/license">License</Link></li>
        </ul>
        <hr className="line" />
        <ul>
            <li><Link to="/Auth">Join Us</Link></li>
        </ul>
    </div>
  )
}

export default responsiveBar
