import './SignIn.css'
import Authentication from '../Authentication'

function SignIn() {
  return (
    <div className='SingInParent'>
      <Authentication value={true}/>
    </div>
  )
}

export default SignIn
