import "./navBar.css";

interface Prop{
    value: boolean;
    setValue: (val :boolean) => void
}

function responsiveBar({value, setValue}: Prop) {
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
