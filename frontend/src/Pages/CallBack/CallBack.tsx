import { useEffect, useState } from 'react'
import { getContext, getendpoint } from '../../context/getContextData'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import './CallBack.css'
import Alert from '../../components/Alert/Alert'
import Preloader from '../Preloader/Preloader'

function CallBack() {
  const authContext = getContext()
  const navigate = useNavigate()
  const [usernameAlert, setUsernameAlert] = useState(false)
  const [showOtpAlert, SetshowOtpAlert] = useState(false) // otp alert
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
  const location = useLocation()
  const handelLogin = async (code: string | null) => {
    if (code)
    {
        if (from === "intra")
        {
          console.log("--------------------------------")
          var url = getendpoint("http", '/api/accounts/login/intra')
          axios
          .get(url, {params: { code: code }, withCredentials: true })
          .then((response) => {
            console.log(response.data.info)
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
                console.log('Success:', response.data)
              })
              .catch((error) => {
                authContext?.setIsLogged(false),
                navigate('/')
              console.error('Error:', error.response ? error.response.data : error.message);
            });
          }
          else if (from === "google")
          {
            console.log(1);
            
            axios
              .get(getendpoint("http", '/api/accounts/login/google'), {params: { code: code }, withCredentials: true })
              .then((response) => {
                
                console.log(response.data.info)
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
                    console.log('Success:', response.data)
                  })
                .catch((error) => {
                  authContext?.setIsLogged(false),
                  navigate('/')
                console.error('Error:', error.response ? error.response.data : error.message);
            });
        }
        else
        {
          authContext?.setIsLogged(false),
          navigate('/')
        }
    } else {
      console.error('error');
      authContext?.setIsLogged(false),
      navigate('/')
    }
  }

  const hadelSaveUsername = () => {
    axios
      .put(getendpoint("http", "/api/accounts/updateUsername/"), {username}, {
        withCredentials: true,
      })
      .then((response) => {
          console.log("gg => ", response.data)
          GetUserInfo()
          authContext?.setIsLogged(true)
          navigate('/')
          authContext?.setUser(response.data)
      })
      .catch((error)=> {
        authContext?.setDisplayed(3);
        console.log(error.response.data)
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
    console.log("from ==========> ", from);
    if (!usernameAlert)
      handelLogin(code)
    console.log(usernameAlert)
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
        // <div className="ripple"></div>
      }
    </div>
  )
}

export default CallBack