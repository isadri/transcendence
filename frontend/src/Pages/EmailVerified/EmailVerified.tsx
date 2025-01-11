import { useNavigate } from 'react-router-dom'
import './EmailVerified.css'
import { getendpoint } from '../../context/getContextData';
import axios from 'axios';
import { useState } from 'react';

function EmailVerified() {
  const params = new URLSearchParams(window.location.search);
  let token = params.get('token');
  let uid = params.get('uid');
  const [isconfirmed, setIsConfirmed] = useState(0)
  if (token && uid) {
    axios.get(getendpoint("http", "/api/accounts/confirm-email/"),
      { params: { token: token, uid: uid }, withCredentials: true })
      .then(() => {
        setIsConfirmed(1)
        token = '';
        uid = '';
      })
      .catch(() => {
        setIsConfirmed(2)
        token = '';
        uid = '';
      })
  }

  const navigate = useNavigate()
  return (
    <div className="GameModePopUpBlur">
      <div className="verifcationAlert">
        {
          isconfirmed === 1 &&
          <div className="contentAlert">
            <div className="iconAlert">
              <i className="fa-solid fa-user-check"></i>
              <span></span>
            </div>
            <div className="content-text">
              <h3>Email Successfully Confirmed!</h3>
              <span>Your email has been successfully verified. You can now log in to your account.</span>
            </div>
            <div className="buttonField">
              <button type="button" onClick={() => navigate('/Auth')}>Go to Login</button>
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

export default EmailVerified