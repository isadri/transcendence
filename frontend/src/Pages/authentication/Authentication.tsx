import './Authenthication.css'
import intra from './Images/intra.svg'
import Google from './Images/Google.svg'
import { useState } from 'react'

interface Props{
  value: boolean
}


function Authentication({value}:Props) {
  const [val, setVal] = useState(value);
  const SingUpStyle = !val
    ? {
        transform: "translateX(100%)",
        opacity: 1,
        zIndex: 5
      }:{}
  return (
    <>
      <div className="SingIn" style={!val ?{transform: "translateX(100%)", opacity:0}:{}} >
        <h1>Sing In</h1>
        <form action="" className=''>
          <input type="text" name="" id="UserName" placeholder='UserName or Email' />
          <input type="text" name="" id="Pass" placeholder='Password'/>
          <a href="">Forget your password?</a>
         <button type='submit'>Sign in</button>
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
      <div className='SingUp' style={SingUpStyle}>
        <h1>Sing Up</h1>
        <form action="">
          {/* <div className='PrimaryInfo'>
            <input type="text" placeholder="First Name"/>
            <input type="text" placeholder="Last Name"/>
          </div> */}
            <input type="text" placeholder="UserName"/>
            <input type="text" placeholder="Email"/>
            <input type="text" placeholder="Create Password"/>
            <input type="text" placeholder="Confirm Password"/>
            <button type='submit'>Sign Up</button>
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
                      <button type='submit' id="registerBtn" className='btn' onClick={() => {setVal(false)}}>Sing Up</button>
                  </div>
              </div>
              <div className='LeftContent' style={!val ?{transform: "translateX(0)"}:{}}>
                  <h1>Welcome Back!</h1>
                  <span>To stay connected with us, 
                      please log in using your personal information, 
                      Google account, or your Intra account.</span>
                  <div className='buttons'>
                      <button type='submit' id="registerBtn" className='btn' onClick={() => {setVal(true)}}>Sing In</button>
                  </div>
              </div>
          </div>
      </div>    
    </>
    )
}

export default Authentication
