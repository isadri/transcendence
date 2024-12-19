import { useEffect, useState } from 'react'
import { getContext, getUser, getendpoint } from '../../context/getContextData'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import './CallBack.css'

function CallBack() {
  const authContext = getContext()
  const user = getUser()
  const navigate = useNavigate()
  const [usernameAlert, setUsernameAlert] = useState(false)
  const [username, setUsername] = useState('')
  const GetUserInfo = () =>{
    axios.get(getendpoint("http", '/'),  {withCredentials:true})
    .then((response) => {
      authContext?.setIsLogged(true)
      authContext?.setUser(response.data)
    })
    .catch(() => {
      authContext?.setIsLogged(false)
      authContext?.setUser(undefined)
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
            console.log(response.data.info)
            if (response.data.info){
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
              console.error('Error:', error.response ? error.response.data : error.message);
            });
          }
          else if (from === "google")
          {
            axios
              .get(getendpoint("http", '/api/accounts/login/google'), {params: { code: code }, withCredentials: true })
              .then((response) => {
                  setTimeout(() => {
                      GetUserInfo()
                      authContext?.setIsLogged(true)
                      navigate('/')
                  }, 2000);
                  console.log('Success:', response.data)
                })
                .catch((error) => {
                  authContext?.setIsLogged(false),
                console.error('Error:', error.response ? error.response.data : error.message);
            });
        }
    } else {
      console.error('error');
    }
  }

  const hadelSaveUsername = () => {
    axios
      .put(getendpoint("http", "/api/accounts/updateUsername/"), {username}, {
        withCredentials: true,
      })
      .then((response) => {
          console.log(response.data)
          authContext?.setUser(response.data)
          navigate('/')
      })
      .catch((error)=> {
        console.log(error.response.data)
      })
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    console.log("from ==========> ", from);
    handelLogin(code)
  }, [authContext, navigate]);

  return (
    <div className="loader-container">
      {
        usernameAlert ? 
        <div className="GameModePopUpBlur">
            <div className="alertDeleteUser alertOTP">
              {/* <div className="cancelIcon">
                <i className="fa-solid fa-xmark" onClick={() => SetshowOtpAlert(false)}></i>
              </div> */}
              <div className="contentOtp">
                <div className="iconEmail">
                <i className="fa-solid fa-user-pen"></i>
                <span></span>
                </div>
                <div className="content-text auth-alert">
                  <h3>Update Your Username</h3>
                  <span>Please ensure your username complies with our policy. It must be
                    alphanumeric and between 3-15 characters. If valid, click "Confirm" to
                    continue.</span>
                  <input className='inputt' type="text" placeholder="Enter Username"
                        value={username} onChange={e => setUsername(e.target.value)}/>
                </div>
                <div className="Codefiled">
                  <button type="submit" onClick={hadelSaveUsername}>Confirm</button>
                </div>
              </div>
            </div>
          </div>
          :
          <div className="ripple"></div>
      }
    </div>
  )
}

export default CallBack