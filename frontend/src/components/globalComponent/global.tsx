import Search from './Search'
import Icons from './Icons'
import './SearchAndIcons.css'
import { useLocation } from 'react-router-dom'

function global() {
  const hideGlobal = useLocation().pathname === "/game/local"
  return (
    <>
      {
        !hideGlobal &&
        <div className='Home-searchAndIcons'>
          <Search />
          <Icons />
        </div>
      }
    </>
  )
}

export default global