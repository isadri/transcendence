import './SignIn.css'
import Authentication from '../Authentication'
import { getContext } from '../../../context/getContextData'
import Alert from '../../../components/Alert/Alert'


function SignIn() {
  const account = getContext()
  return (
    <>
      <div className='Auth'>
        <Authentication />
      </div>
    </>
  )
}

export default SignIn
