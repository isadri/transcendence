import Search from './Search'
import Icons from './Icons'
import './SearchAndIcons.css'

function global() {
  return (
    <>
      {
        <div className='Home-searchAndIcons'>
          <Search />
          <Icons />
        </div>
      }
    </>
  )
}

export default global