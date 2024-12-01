
import './Authenthication.css'
import intra from './Images/intra.svg'
import Google from './Images/Google.svg'
import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMediaQuery } from "@uidotdev/usehooks";
import axios from 'axios'
import {loginContext} from './../../App'


interface errorDataTypes{
  username : string,
  email : string,
  password : string,
  confirmPassword : string
}

function Authentication() {
  const authContext = useContext(loginContext)
  const navigate = useNavigate();
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [val, setVal] = useState(true)

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
  // const hostname = window.location.hostname
  const url_login = 'http://'+`${authContext?.hostname}`+':8000/api/accounts/login/'
  
  const data_reg = {
    username,
    password,
    email
  }
  const url_reg = 'http://'+`${authContext?.hostname}`+':8000/api/accounts/register/'
  
  const handelIntraLogin = (e: any) => {
    axios.get('http://localhost:8000/api/accounts/login/intra/')
      .then(() =>{
        // console.log("saccess")
      })
      .catch(() => {
        // console.log("failer")
      })
  }
  const handelgGoogleLogin = (e: any) => {
    axios.get('http://localhost:8000/api/accounts/login/google/')
      .then(() =>{
        // console.log("saccess")
      })
      .catch(() => {
        // console.log("failer")
      })
  }
  const GetUserInfo = () =>{
    axios.get('http://'+`${authContext?.hostname}`+':8000/',  {withCredentials:true})
    .then((response) => {
      authContext?.setIsLogged(true)
      authContext?.setUser(response.data)
    })
    .catch(() => {
      authContext?.setIsLogged(false)
      authContext?.setUser(undefined)
    })
  }
  const handelSubmit = (e: any, str: string) => {
    if (str === "signin" || (str === "signup" && confirmPassword === password))
    {
      e.preventDefault();
      const endpont = val ? url_login : url_reg
      const data = val ? data_login : data_reg
      axios.post(endpont, data, {withCredentials: true})
            .then(() => {
                !val ? setVal(true) :
                (
                  navigate('/'),
                  authContext?.setIsLogged(true),
                  GetUserInfo()
                );
                setUsername('')
                setEmail('')
                setPassword('')
            })
            .catch((error) => {
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
          confirmPassword:"password do not match!!"}))
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
              <div onClick={handelgGoogleLogin}>
                <img src={Google} alt="" />
              </div>
            </div>
            <div className='IntraConx'>
              <div onClick={handelIntraLogin}>
                <img src={intra} alt="" />
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
            <button>
              <img src={Google} alt="" />
            </button>
          </div>
          <div className='IntraConx'>
            <div>
              <img src={intra} alt="" />
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
    </>
    )
}

export default Authentication
