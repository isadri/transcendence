import '../styles/ProfileUser.css'
import img from '../images/profile.svg'

function ProfileUser() {
  return (
    <div className='Home-ProfileUser'>
      <div className='Home-ProfileElements'>
        <div className='Home-Btn'>
          <h2>Profile</h2>
          <button type='submit'>Edit</button>
        </div>
        <div className='Home-ProfileContent'>
          <div className='Home-imgUser'>
            <div className="Home-img" >
              <img src={img} alt="" />
            </div>
            <div className='Home-UserName'>
              <span>User123</span>
              <div className='Home-online'>
                <div className='Home-Circle'></div>
                <span>Online</span>
              </div>
            </div>
          </div>
          <div className='Home-ProfileLevel'>
            <div className='Home-XpClass'>
              <span>15000px / 12000xp </span>
            </div>
            <div className="Home-level-bar">
              <div className="Home-level-bar-fill"></div>
              <span className="Home-level-text">level 7 - 70%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileUser
