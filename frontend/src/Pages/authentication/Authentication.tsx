import './Authenthication.css'
import intra from './Images/intra.svg'
import Google from './Images/Google.svg'
import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMediaQuery } from "@uidotdev/usehooks";
import axios from 'axios'
import {loginContext} from './../../App'


function Authentication() {
  const authContext = useContext(loginContext)
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [val, setVal] = useState(true);
  const [Error, setError] = useState(false);
  const [errorList, setErrorList] = useState<string[][]>([]);
  const data_login = {
      username,
      password
  }
  const url_login = 'http://localhost:8000/api/accounts/login/'
  
  const data_reg = {
    username,
    password,
    email
  }
  const url_reg = 'http://localhost:8000/api/accounts/register/'
  
  const handelSubmit = (e: any) => {
    e.preventDefault();
    const endpont = val ? url_login : url_reg
    const data = val ? data_login : data_reg
    axios.post(endpont, data, {withCredentials: true})
          .then(() => {
              !val ? setVal(true) : (navigate('/'), authContext?.setIsLogged(true));
              setUsername('')
              setEmail('')
              setPassword('')
          })
          .catch((error) => {
            setError(true)
            if (error.response){
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
  const checkError = (str: string) => {
    for (let i = 0; i < errorList.length; i++) {
      console.log("Checking:", errorList[i][0], "against:", str);
      if (errorList[i][0] === str)
        console.log(errorList[i])
        return errorList[i];
    }
    return "empty";
  };

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
          <form onSubmit={handelSubmit}>
            {
              Error && checkError("error") && checkError("error")[0] === "error" &&
              <p className='errorSet'>Invalid username or password</p>
            }
            <input type="text" name="username" id="UserName" placeholder='UserName or Email'
             value={username} onChange={(e) => setUsername(e.target.value)} required/>
            <input type="text" name="password" id="Pass" placeholder='Password'
            value={password} onChange={(e) => setPassword(e.target.value)} required/>
            <Link to="">Forget your password?</Link>
            <button type='submit' aria-label="Sign in">Sign in</button>
            <span className='RespSign'>Don't have an account? <Link to="" onClick={() => {setVal(false)}}>Sign Up</Link></span>
          </form>
          <div className='lines'>
            <span></span>
            <p>OR</p>
            <span></span>
          </div>
          <div className='DirectConx'>
            <div className='GoogleConx'>
              <a>
                <img src={Google} alt="" />
              </a>
            </div>
            <div className='IntraConx'>
              <a>
                <img src={intra} alt="" />
              </a>
            </div>
          </div>
      </div>
      <div className='SingUp ' style={{...SingUpStyle, ...(!val && win_width ? {opacity:1, transform: "translateX(0%)"}:{})}}>
          <div className='iconBack' style={win_width ? {opacity : 1}:{opacity : 0}}>
              <Link to="/">
                <i className="fa-solid fa-arrow-left"></i>
              </Link>
          </div>
          <h1>Sign Up</h1>
          <form onSubmit={handelSubmit}>
            <input type="text" name="username" id="UserName" placeholder='UserName'
              value={username} onChange={(e) => setUsername(e.target.value)} required/>
              {
                Error && checkError("username") && checkError("username")[0] === "username" &&
                <p className='errorSet'>{checkError("username")[1]}</p>
              }
            <input type="text" name="Email" id="Email"  placeholder="Email"
              value={email} onChange={(e) => setEmail(e.target.value)} required/>
              {
                Error && checkError("email") && checkError("email")[0] === "email" &&
                <p className='errorSet'>{checkError("email")[1]}</p>
              }
            <input type="text" name="password" id="Pass" placeholder='Password'
            value={password} onChange={(e) => setPassword(e.target.value)} required/>
            {
              Error && checkError("password") && checkError("password")[0] === "password" &&
              <p className='errorSet'>{checkError("password")[1]}</p>
            }
            <input type="text" placeholder="Confirm Password" required/>
            <button type='submit'>Sign Up</button>
            <span className='RespSign'>Already have an account? <Link to="" onClick={() => {setVal(true)}}>Sign In</Link></span>
          </form>
        <div className='lines'>
          <span></span>
          <p>OR</p>
          <span></span>
        </div>
        <div className='DirectConx'>
          <div className='GoogleConx'>
            <a>
              <img src={Google} alt="" />
            </a>
          </div>
          <div className='IntraConx'>
            <a>
              <img src={intra} alt="" />
            </a>
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
          {/* <div className='iconBack' style={val && win_width ? {opacity: 0}: {opacity: 1}}>
            <Link to="/">
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
          </div> */}
      </div>
    </>
    )
}

export default Authentication
