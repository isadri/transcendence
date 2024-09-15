import '../styles/ProfileUser.css'
import img from '../images/profile.svg'

function ProfileUser() {
  return (
    <div className='ProfileUser'>
      <div className='Btn'>
        <h2>Profile</h2>
        <button type='submit'>Edit</button>
      </div>
      <div className='ProfileContent'>
        <div className='imgUser'>
          <div className="img" >
            <img src={img} alt="" />
          </div>
          <div className='UserName'>
            <span>User123</span>
            <div className='online'>
              <div className='Circle'></div>
              <span>Online</span>
            </div>
          </div>
        </div>
        <div className="levelUser">
            <div className="levelUpUser">
              <span>lvl 10</span>
              <span>15000xp/12000xp</span>
            </div>
          </div>
      </div>
    </div>
  )
}

export default ProfileUser
