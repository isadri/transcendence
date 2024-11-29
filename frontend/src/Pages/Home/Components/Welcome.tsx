import { useContext } from 'react';
import { loginContext } from '../../../App';
import WlcmImg from '../images/girl.svg'


function Welcome() {
  const userContext = useContext(loginContext)
  if (userContext)
  {
    const  {user} = userContext
    console.log(user);
    return (
      <>
        <div className='Home-content'>
          <h3>Welcome back, user!</h3>
          <p>
          Feeling sharp today? We've got a fresh batch of challenges waiting for you.
          You can smash your way through some AI opponents in Practice Mode,
          test your mettle against a random player in Quick Match,
          or even challenge a friend to a Friendly Feud!  Remember,
          every victory earns you points to level up and unlock awesome new paddles.
          So grab your paddle, step up to the table, and let's see what you've got!
          </p>
        </div>
        <div className='Home-Image'>
          <img src={WlcmImg} alt="" />
        </div> 
    </>
  )
}
}

export default Welcome