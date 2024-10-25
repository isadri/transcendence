import './Setting.css'
import img from './images/avatar1.jpeg'
import { Link } from 'react-router-dom'

const Setting = () => {
  return (
    <div className='Par'>
      <div className="settingPage">
      <h1>Settings</h1>
      <div className='settingContent'>
        <div className='ChangeAvatar'>
          <img src={img} alt="" />
          <div className='btns'>
            <button type='submit'>Remove</button>
            <button type='submit'>Change</button>
          </div>
        </div>
        <div className='ProfileEdit'>
          <h2>Edit Profile</h2>
          <form action="">
            <div className='ProfileEdit-C1'>
              <label htmlFor="">username</label>
              <input type="text" name="" id="" />
            </div>
            <div className='ProfileEdit-C2'>
              <label htmlFor="">Email</label>
              <input type="text" name="" id="" />
            </div>
          </form>
        </div>
        <div className='ChangePass'>
          <h2>Change Password</h2>
          <form action="">
            <div className='ChangePass-C1'>
              <label htmlFor="">Old Password</label>
              <input type="text" name="" id="" />
              <label htmlFor="">Confirm Password</label>
              <input type="text" name="" id="" />
            </div>
            <div className='ChangePass-C2'>
              <label htmlFor="">New Password</label>
              <input type="text" name="" id="" />
            </div>
          </form>
        </div>
        <div className='Setting-action'>
          <Link to="#">
            <i className="fa-solid fa-trash-can"></i>
            Delete Account
          </Link>
          <button type='submit'>Save Changes</button>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Setting