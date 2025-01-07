import "./navBar.css";
import { Link } from "react-router-dom";

function responsiveBar({setValue}:{setValue: React.Dispatch<React.SetStateAction<boolean>>}) {
  return (
    <div className='resBar'>
        <ul >
          <li><Link to="/landing" onClick={()=> setValue(false)}>Home</Link></li>
          <li><Link to="/aboutUs" onClick={()=> setValue(false)}>AboutUs</Link></li>
          <li><Link to="/license" onClick={()=> setValue(false)}>License</Link></li>
        </ul>
        <hr className="line" />
        <ul>
            <li><Link to="/Auth">Join Us</Link></li>
        </ul>
    </div>
  )
}

export default responsiveBar
