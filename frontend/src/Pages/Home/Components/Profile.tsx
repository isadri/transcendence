import ProfileImg from '../images/profile.svg'
import Cbadge from '../images/CourentBadge.svg'


function Profile() {
  return (
    <div className='profile'>
        <img className='ProfImg' src={ProfileImg} alt="" />
        <div className='user'>
          <p>user1</p>
          <img src={Cbadge} alt="" />
        </div>
        <div className='level'>
          <div className='levelUp'>
            level 1
          </div>
        </div>
        <div className='comstats-containe'>
          <div className='state'>
            <div>5</div>
            <div>Wins</div>
          </div>
          <div className='state'>
            <div>0</div>
            <div>Loss</div>
          </div>
          <div className='state'>
            <div>10</div>
            <div>Rank</div>
          </div>
        </div>
    </div>
  )
}

export default Profile
