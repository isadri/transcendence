import { useEffect, useState } from 'react'
import { getContext, getendpoint } from '../../context/getContextData'
import {  useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import './CallBack.css'
import Preloader from '../Preloader/Preloader'

function CallBack() {
  const authContext = getContext()
  const navigate = useNavigate()
  const [usernameAlert, setUsernameAlert] = useState(false)
  const [showOtpAlert, SetshowOtpAlert] = useState(false) 
  const [username, setUsername] = useState('')
  const [userCode, setUserCode] = useState('')
  const [otpcode, setOtpCode] = useState('')
  const GetUserInfo = () =>{
    axios.get(getendpoint("http", '/api'),  {withCredentials:true})
    .then((response) => {
      authContext?.setIsLogged(true)
      authContext?.setUser(response.data)
    })
    .catch(() => {
      authContext?.setIsLogged(false)
      authContext?.setUser(null)
    })
  }
  const {from} = useParams()
  const handelLogin = async (code: string | null) => {
    if (code)
    {
        if (from === "intra")
        {
          var url = getendpoint("http", '/api/accounts/login/intra')
          axios
          .get(url, {params: { code: code }, withCredentials: true })
          .then((response) => {
            if (response.data.info && response.data.code){
              setUserCode(response.data.code)
              SetshowOtpAlert(true)
            }
            else if (response.data.info){
              authContext?.setUser(response.data)
              setUsernameAlert(true)
            }
            else{
              setTimeout(() => {
                GetUserInfo()
                authContext?.setIsLogged(true)
                navigate('/')
              }, 2000);
            }
              })
              .catch(() => {
                authContext?.setIsLogged(false),
                navigate('/')
            });
          }
          else if (from === "google")
          {
            axios
              .get(getendpoint("http", '/api/accounts/login/google'), {params: { code: code }, withCredentials: true })
              .then((response) => {
                if (response.data.info && response.data.code){
                  setUserCode(response.data.code)
                  SetshowOtpAlert(true)
                }
                else if (response.data.info){
                  authContext?.setUser(response.data)
                  setUsernameAlert(true)
                }
                else{
                    setTimeout(() => {
                      GetUserInfo()
                      authContext?.setIsLogged(true)
                      navigate('/')
                    }, 2000);
                }
                  })
                .catch(() => {
                  authContext?.setIsLogged(false),
                  navigate('/')
            });
        }
        else
        {
          authContext?.setIsLogged(false),
          navigate('/')
        }
    } else {
      authContext?.setIsLogged(false),
      navigate('/')
    }
  }

  const hadelSaveUsername = () => {
    axios
      .put(getendpoint("http", "/api/accounts/updateuserData/"), {username}, {
        withCredentials: true,
      })
      .then((response) => {
          GetUserInfo()
          authContext?.setIsLogged(true)
          navigate('/')
          authContext?.setUser(response.data.data)
      })
      .catch((error)=> {
        authContext?.setDisplayed(3);
        authContext?.setCreatedAlert(error.response.data.username[0]);
      })
  }

  const handelVerifyCode = () =>{
    axios
      .post(getendpoint("http", "/api/accounts/verify-otp/"),
      {key: otpcode, code: userCode},
      {withCredentials : true})
      .then(() => {
        GetUserInfo()
        authContext?.setIsLogged(true)
        navigate('/')
        SetshowOtpAlert(false)
      })
      .catch(error => {
        authContext?.setDisplayed(3)
        authContext?.setCreatedAlert(error.response.data.error);
        SetshowOtpAlert(false)
        navigate('/Auth')
      })
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (!usernameAlert)
      handelLogin(code)
  }, [authContext, navigate]);

  return (
    <div className="loader-container">
      {
        usernameAlert || showOtpAlert ?
        (
          usernameAlert ?
          <div className='alerUsername'>
            <div className="alertDeleteUser alertOTP userAlert">
              <div className="contentOtp">
                <div className="iconEmail">
                <i className="fa-solid fa-user-pen"></i>
                <span></span>
                </div>
                <div className="content-text auth-alert username-Alert">
                  <h3>Update Your Username</h3>
                  <span>Please ensure your username complies with our policy. It must be
                    alphanumeric and between 3-15 characters. If valid, click "Confirm" to
                    continue.</span>
                  <input className='inputt' type="text" placeholder="Enter Username"
                        value={username} onChange={e => setUsername(e.target.value.toLowerCase())}/>
                </div>
                <div className="Codefiled">
                  <button type="submit" onClick={hadelSaveUsername}>Confirm</button>
                </div>
              </div>
            </div>
            </div>
            :
          <div className="GameModePopUpBlur">
             <div className="alertDeleteUser alertOTP">
               <div className="cancelIcon">
                 <i className="fa-solid fa-xmark" 
                 onClick={() => {SetshowOtpAlert(false), navigate('/Auth')}}></i>
               </div>
               <div className="contentOtp">
                 <div className="iconEmail">
                 <i className="fa-solid fa-envelope-open-text"></i>
                 <span></span>
                 </div>
                 <div className="content-text">
                   <h3>Please enter the verification code to activate Two-Factor Authentication</h3>
                   <span>A verification code has been sent to your email. Please check your inbox.</span>
                   <input className='inputt' type="text" placeholder="Enter Code" 
                     value={otpcode} onChange={e => setOtpCode(e.target.value)}/>
                 </div>
                 <div className="Codefiled">
                   <button type="submit" onClick={handelVerifyCode} >Verify</button>
                 </div>
               </div>
             </div>
            </div>
        )
        :
          <Preloader/>
      }
    </div>
  )
}

export default CallBack