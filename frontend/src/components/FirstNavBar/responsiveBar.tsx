import "./navBar.css";

function responsiveBar() {
  return (
    <div className='resBar'>
        <ul >
          <li><a href="#">Home</a></li>
          <li><a href="#">AboutUs</a></li>
          <li><a href="#">License</a></li>
        </ul>
        <hr className="line" />
        <ul>
            <li><a href="#">Sign In</a></li>
            <li><a href="#">Sign Up</a></li>
        </ul>
    </div>
  )
}

export default responsiveBar
