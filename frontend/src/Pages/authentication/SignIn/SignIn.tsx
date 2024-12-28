import './SignIn.css'
import Authentication from '../Authentication'
import { getContext } from '../../../context/getContextData'
import Alert from '../../../components/Alert/Alert'


function SignIn() {
  const account = getContext()
  return (
    <>
      <Alert primaryColor='#ff00005a' secondaryColor='#f18b8b'>
          {/* <i className="fa-solid fa-circle-exclamation"></i> */}
          <span>{account?.createdAlert}</span>
      </Alert>
      <div className='Auth'>
        <Authentication />
      </div>
    </>
  )
}

export default SignIn
