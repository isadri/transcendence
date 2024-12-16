
import './Authenthication.css'
import intra from './Images/intra.svg'
import Google from './Images/Google.svg'
import { useEffect, useState } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import { useMediaQuery } from "@uidotdev/usehooks";
import axios from 'axios'
import { getContext, getendpoint } from '../../context/getContextData'


interface errorDataTypes{
  username : string,
  email : string,
  password : string,
  confirmPassword : string
}

function Authentication() {
  const [url, setUrl] = useState("")
  const [urlGoogle, setUrlGoogle] = useState("")
  const [isOtpActive, setIsOtpActive] = useState(false) //variable to store the state of otp is active or not
  useEffect(() => {
    axios.get(getendpoint("http", "/api/accounts/GetIntraLink/"))
      .then(response => {
          setUrl(response.data)
        })
    axios.get(getendpoint("http", "/api/accounts/GetGoogleLink/"))
        .then(response => {
            setUrlGoogle(response.data)
        })
  }, [url, urlGoogle])
  // console.log("---->", url)
  const authContext = getContext()
  const navigate = useNavigate();
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [val, setVal] = useState(true)
  const [showOtpAlert, SetshowOtpAlert] = useState(false) // otp alert
  const [Error, setError] = useState(false);
  const [errorList, setErrorList] = useState<string[][]>([])
  const [errors, SetErrors] = useState<errorDataTypes>({
    username : '',
    email : '',
    password : '',
    confirmPassword: ''
  })

  const data_login = {
      username,
      password
  }

  var url_login = getendpoint("http", '/api/accounts/login/')
  // if (isOtpActive)
  //   url_login = getendpoint("http", '/api/accounts/login2fa/')
  
  const data_reg = {
    username,
    password,
    email
  }
  const url_reg = getendpoint("http", '/api/accounts/register/')
  const GetUserInfo = () =>{
    axios.get(getendpoint('http', '/'),  {withCredentials:true})
    .then((response:any) => {
      authContext?.setIsLogged(true)
      authContext?.setUser(response.data)
    })
    .catch(() => {
      authContext?.setIsLogged(false)
      authContext?.setUser(undefined)
    })
  }
  const handelSubmit = async (e: any, str: string) => {
    if (str === "signin" || (str === "signup" && confirmPassword === password))
    {
      e.preventDefault();
      const data = val ? data_login : data_reg
      const otpResponse = await axios.get(getendpoint("http", `/api/accounts/SendOTPView/${data.username}`), {withCredentials: true})
      // .then((response) => {
      //   if (response.data === true){
      //     console.log("otp is ", response.data)
      //     url_login = getendpoint("http", '/api/accounts/login2fa/')
      //     console.log("url_login => ", url_login)
      //     setIsOtpActive(true)
      //   }
      // })
      if (otpResponse.data === true) {
        console.log("otp is ", otpResponse.data)
          url_login = getendpoint("http", '/api/accounts/login2fa/')
          console.log("url_login => ", url_login)
          // setIsOtpActive(true)
      }
      const endpont = val ? url_login : url_reg
      console.log(endpont)
      console.log("otp var => ", isOtpActive)
      axios.post(endpont, data, {withCredentials: true})
            .then(() => {
              if (!val) {
                setVal(true);
              } else {
                if (otpResponse.data) {
                  console.log("otp is active in the auth")
                  // Handle OTP active case
                  SetshowOtpAlert(true)
                  // axios.post(getendpoint("http", "/api/accounts/SendOTPView/"),
                  // {val: true}, {withCredentials: true}) // Send email to user
                } else {
                  console.log("the user loged in a normal way")
                  authContext?.setIsLogged(true);
                  navigate('/');
                  GetUserInfo();
                }
              }
              setUsername('')
              setEmail('')
              setPassword('')
              SetErrors({
              username: '',
              email: '',
              password: '',
              confirmPassword: ''
            });
          })
          .catch((error:any) => {
            console.log(error.response.data)
            setError(true)
            if (error.response && error.response.data){
              const list = []
              const errors = error.response.data;
              for (const field in errors) {
                  if (errors[field].length > 0) {
                    list.push([field, errors[field][0]])
                  }
              }
              setErrorList(list)
             }
             else if (error.request){
              //to do
             }
          });
    }
  }

  const checkError = (str: string) => {
    for (let i = 0; i < errorList.length; i++) {
      if (errorList[i][0] === str)
        return errorList[i];
    }
    return "empty";
  };

  const handelRegisterErorrs = (e: any, str : string) => {
  if (str === "username"){
    if (!/^[a-zA-Z0-9._-]{3,15}$/.test(e.target.value))
      SetErrors(prevState => ({
        ...prevState,
        username:"Please enter a valid username. It must be at least 3 and 15 characters long ,can only contain letters, numbers, and '_', '-', '.'"}))
    else
      SetErrors(prevstate => ({
        ...prevstate,
        username:""}))
    setUsername(e.target.value)
  }
  else if (str === "password"){
    if (e.target.value.length < 8)
      SetErrors(prevState => ({
        ...prevState,
        password: "Password must be at least 8 characters long."
      }))
    else if (!/[A-Z]/.test(e.target.value))
      SetErrors(prevState => ({
        ...prevState,
        password:"Password must contain at least one uppercase latter."}))
    else if (!/[a-z]/.test(e.target.value))
      SetErrors(prevState => ({
        ...prevState,
        password:"Password must contain at least one lowercase letter."}))
    else if (!/[0-9]/.test(e.target.value))
      SetErrors(prevState => ({
        ...prevState,
        password:"Password must contain at least one digit"}))
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(e.target.value))
      SetErrors(prevState => ({
        ...prevState,
        password:"Password must contain at least one special charachter."}))
    else
      SetErrors(prevState => ({
        ...prevState,
        password:""}))
    setPassword(e.target.value)
  }
  else if (str === "email"){
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(e.target.value))
      SetErrors(prevState => ({
        ...prevState,
        email:"Please enter a valid email."}))
        else
        SetErrors(prevState => ({
      ...prevState,
      email:""}))
      setEmail(e.target.value)
    }
    else if (str === "confirmPassword"){
      setConfirmPassword(e.target.value)
      if (e.target.value !== password)
      {
        SetErrors(prevState => ({
          ...prevState,
          confirmPassword:"Password do not match!!"}))
        }
      else{
        SetErrors(prevState => ({
          ...prevState,
          confirmPassword:""}))
      }
    }
  }
  const win_width = useMediaQuery("only screen and (max-width : 720px)");
  const SingUpStyle = !val ?
    (
      win_width ?
      {
        transform: "translateX(100%)",
        opacity: 1,
      } :
      {
        transform: "translateX(100%)",
        opacity: 1,
        zIndex: 5
      }
    ):{transform: "translateX(-100%)"};

    return (
    <>
      <div className="SingIn" style={{...(!val ? { transform: "translateX(200%)", opacity: 0 } : {}),
          ...(!val && win_width ? {opacity:0}:{opacity:1})}} >
            <div className='iconBack'>
              <Link to="/">
                <i className="fa-solid fa-arrow-left"></i>
              </Link>
            </div>
          <h1>Sign In</h1>
          <div className='form' >
            {
              Error && checkError("error") && checkError("error")[0] === "error" &&
              <p className='errorSet'>Invalid username or password</p>
            }
            <input type="text" name="username" id="UserName" placeholder='UserName or Email'
             value={username} onChange={(e) => setUsername(e.target.value)} required/>
            <input type="text" name="password" id="Pass" placeholder='Password'
            value={password} onChange={(e) => setPassword(e.target.value)} required/>
            <Link to="">Forget your password?</Link>
            <button type='submit' aria-label="Sign in" onClick={e => handelSubmit(e, "signin")}>Sign in</button>
            <span className='RespSign'>Don't have an account? <Link to="" onClick={() => {setVal(false)}}>Sign Up</Link></span>
          </div>
          <div className='lines'>
            <span></span>
            <p>OR</p>
            <span></span>
          </div>
          <div className='DirectConx'>
            <div className='GoogleConx'>
              <Link to={urlGoogle}>
                <img src={Google} alt="google"/>
              </Link>
            </div>
            <div className='IntraConx'>
              <div >
                <Link to={url}>
                  <img src={intra} alt="intra"/>
                </Link>
              </div>
            </div>
          </div>
      </div>
      <div className='SingUp ' style={{...SingUpStyle, ...(!val && win_width ? {opacity:1, transform: "translateX(0%)"}:{})}}>
          <div className='iconBack' style={win_width ? {opacity : 1}:{opacity : 0}} >
              <Link to="/">
                <i className="fa-solid fa-arrow-left"></i>
              </Link>
          </div>
          <h1>Sign Up</h1>
          <div className='form' >
            <input type="text" name="username" id="UserName" placeholder='UserName'
              value={username} onChange={(e) => handelRegisterErorrs(e, "username")} required/>
              {
                errors.username !== '' && <p className='errorSet' >{errors.username}</p>
              }
            <input type="text" name="Email" id="Email"  placeholder="Email"
              value={email} onChange={(e) => handelRegisterErorrs(e, "email")} required/>
              {
                 errors.email !== '' && <p className='errorSet' >{errors.email}</p>
              }
            <input type="text" name="password" id="Pass" placeholder='Password'
            value={password} onChange={(e) => handelRegisterErorrs(e, "password")} required/>
            {
              errors.password !== ''  && <p className='errorSet' >{errors.password}</p>
            }
            <input type="text" placeholder="Confirm Password" value={confirmPassword} onChange={e => handelRegisterErorrs(e, "confirmPassword")}/>
            {
              errors.confirmPassword !== ''  && <p className='errorSet' >{errors.confirmPassword}</p>
            }
            <button type='submit' onClick={e => handelSubmit(e, "signup")}>Sign Up</button>
            <span className='RespSign'>Already have an account? <Link to="" onClick={() => {setVal(true)}}>Sign In</Link></span>
          </div>
        <div className='lines'>
          <span></span>
          <p>OR</p>
          <span></span>
        </div>
        <div className='DirectConx'>
          <div className='GoogleConx'>
            <Link to={urlGoogle}>
              <img src={Google} alt="google"/>
            </Link>
          </div>
          <div className='IntraConx'>
              <div >
                <Link to={url}>
                  <img src={intra} alt="intra"/>
                </Link>
              </div>
          </div>
        </div>
      </div>
      <div className='SecondContainer' style={!val ?{transform: "translateX(-100%)"}:{}}>
          <div className='content' style={!val ?{transform: "translateX(50%)"}:{}}>
              <div className='RightContent' style={!val ?{transform: "translateX(20%)"}:{}}>
                  <h1>Hello, Friend!</h1>
                  <span>Share your details and begin your journey with us today.</span>
                  <div className='buttons'>
                    <Link to='/Auth'>
                      <button type='submit' id="registerBtn" className='btn'
                         onClick={() => {setVal(false)}}>Sing Up</button>
                    </Link>
                  </div>
              </div>
              <div className='LeftContent' style={!val ?{transform: "translateX(0)"}:{}}>
                <div className='iconBack'>
                  <Link to="/">
                    <i className="fa-solid fa-arrow-left"></i>
                  </Link>
                </div>
                <h1>Welcome Back!</h1>
                <span>To stay connected with us, 
                  please log in using your personal information, 
                  Google account, or your Intra account.</span>
                <div className='buttons'>
                  <Link to='/Auth'>
                    <button type='submit' id="registerBtn" className='btn'
                      onClick={() => {setVal(true);}}>Sing In</button>
                  </Link>
                </div>
              </div>
          </div>
      </div>
      {
        showOtpAlert && 
        <div className="GameModePopUpBlur">
          <div className="alertDeleteUser alertOTP">
            <div className="cancelIcon">
              <i className="fa-solid fa-xmark" onClick={() => {setIsOtpActive(false)}}></i>
            </div>
            <div className="contentOtp">
              <div className="iconEmail">
              <i className="fa-solid fa-envelope-open-text"></i>
              <span></span>
              </div>
              <div className="content-text">
                <h3>Please enter the verification code to activate Two-Factor Authentication</h3>
                <span>A verification code has been sent to your email. Please check your inbox.</span>
                <input type="text" placeholder="Enter Code" />
              </div>
              <div className="Codefiled">
                <button type="submit">Verify</button>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default Authentication

