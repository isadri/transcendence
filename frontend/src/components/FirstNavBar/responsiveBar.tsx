import "./navBar.css";
import { Link } from "react-router-dom";

function responsiveBar() {
  return (
    <div className='resBar'>
        <ul >
          <li><Link to="#">Home</Link></li>
          <li><Link to="#">AboutUs</Link></li>
          <li><Link to="#">License</Link></li>
        </ul>
        <hr className="line" />
        <ul>
            <li><Link to="#">Sign In</Link></li>
            <li><Link to="#">Sign Up</Link></li>
        </ul>
    </div>
  )
}

export default responsiveBar
