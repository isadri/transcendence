import { useEffect } from 'react'
import { getContext, getendpoint } from '../../context/getContextData'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import './CallBack.css'

function CallBack() {
  const authContext = getContext()
  const navigate = useNavigate()

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
                setTimeout(() => {
                    authContext?.setIsLogged(true)
                    navigate('/')
                    GetUserInfo()
                }, 2000);
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
                      authContext?.setIsLogged(true)
                      navigate('/')
                      GetUserInfo()
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
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    console.log("from ==========> ", from);
    handelLogin(code)
  }, [authContext, navigate]);

  return (
    <div className="loader-container">
        <div className="ripple"></div>
    </div>
  )
}

export default CallBack