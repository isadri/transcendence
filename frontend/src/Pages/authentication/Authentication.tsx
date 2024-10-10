import './Authenthication.css'
import intra from './Images/intra.svg'
import Google from './Images/Google.svg'

function Authentication() {
  return (
    <>
        {/* <div className='FirstContiner'> */}
      <div className="SingIn">
        <h1>Sing In</h1>
        <div className='GoogleConx'>
          <a>
            <img src={Google} alt="" />
          </a>
          <span>Sign In With Google</span>
        </div>
        <div className='IntraConx'>
          <a>
            <img src={intra} alt="" />
          </a>
          <span>Sign In With Intra42</span>
        </div>
        <form action="" className=''>
          <input type="text" name="" id="UserName" placeholder='UserName or Email' />
          <input type="text" name="" id="Pass" placeholder='Password'/>
          <a href="">Forget your password?</a>
         <button type='submit'>Sign in</button>
        </form>
      </div>
      <div className='SingUp'>
        <h1>Sing Up</h1>
        <form action="">
            <input type="text" placeholder="First Name"/>
            <input type="text" placeholder="Last Name"/>
            <input type="text" placeholder="UserName"/>
            <input type="text" placeholder="Email"/>
            <input type="text" placeholder="Create Password"/>
            <input type="text" placeholder="Confirm Password"/>
        </form>
      </div>
    {/* </div> */}
        <div className='SecondContainer'>
            <div className='content'>
                <div className='RightContent'>
                    <h1>Hello, Friend!</h1>
                    <span>Share your details and begin your journey with us today.</span>
                    <button type='submit'>Sing Up</button>
                </div>
                <div className='LeftContent'>
                    <h1>Welcome Back!</h1>
                    <span>To stay connected with us, 
                        please log in using your personal information, 
                        Google account, or your Intra account.</span>
                    <button type='submit'>Sing In</button>
                </div>
            </div>
        </div>    
    </>
    )
}

export default Authentication
