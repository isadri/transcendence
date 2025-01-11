import { useNavigate } from 'react-router-dom'
import './ResetPassword.css'
import { getContext, getendpoint } from '../../context/getContextData';
import axios from 'axios';
import { useState } from 'react';

function ResetPassword() {
  const authcontext = getContext()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const params = new URLSearchParams(window.location.search);
  let token = params.get('token');
  let uid = params.get('uid');
  const [isconfirmed, setIsConfirmed] = useState(0)
  if (token && uid) {
    axios.get(getendpoint("http", "/api/accounts/password-reset-confirm/"),
      { params: { token: token, uid: uid }, withCredentials: true })
      .then(() => {
        setIsConfirmed(1)
      })
      .catch(() => {
        setIsConfirmed(2)
      })
  }

  const handelchangePassword = () => {
    if (password !== '' && confirmPassword !== '')
    {
      if (password === confirmPassword)
      {
        axios.post(getendpoint("http", "/api/accounts/password-reset-confirm/"),
        {password, token, uid},
        {withCredentials: true })
        .then(response => {
          navigate('/Auth')
          authcontext?.setCreatedAlert(response.data.message)
          authcontext?.setDisplayed(5)
        })
        .catch(error => {
          setError(error.response.data.password)
        })
      }
      else
        setError("Password do not match!!")
    }
    else
    {
      authcontext?.setDisplayed(3);
      authcontext?.setCreatedAlert("Please fill in all required fields");
    }
  }

  return (
    <div className="resetPassword">
      <div className="verifcationAlert">
        {
          isconfirmed === 1 &&
          <div className="contentAlert">
            <div className="iconAlert">
              <i className="fa-solid fa-unlock-keyhole"></i>
              <span></span>
            </div>
            <div className="content-text resetpass">
              <div>
                <h3>Change your password</h3>
                <span>Enter a new password below to change your password.</span>
              </div>
              <div className="inputs-filed">
                    <input
                      type="password"
                      placeholder="New Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                      type="password"
                      placeholder="Confirm your Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
            </div>
            <div className="errorPass">
              <p >{error}</p>
            </div>
            <div className="buttonField">
              <button type="button" onClick={() => {handelchangePassword()}}>Change Password</button>
            </div>
          </div>
        }
        {
          isconfirmed === 2 &&
          <div className="contentAlert">
            <div className="iconAlert">
              <i className="fa-solid fa-user-xmark" style={{color: '#c92929'}}></i>
              <span style={{background: "linear-gradient(to right, #c92929, #cccccc)"}}></span>
            </div>
            <div className="content-text">
              <h3>Email validation failed!</h3>
              <span>Verification failed. An error may have occurred, please try again.</span>
            </div>
            <div className="buttonField">
              <button type="button" style={{backgroundColor: '#c92929', border: '#c92929'}} onClick={() => navigate('/Auth')}>Go to Login</button>
            </div>
          </div>
        }
      </div>
    </div>

  )
}

export default ResetPassword