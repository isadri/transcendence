import '../styles/BadgesList.css'
import bg5 from '../images/badge5.svg' 
import bg2 from '../images/badge2.svg' 
import bg3 from '../images/badge3.svg' 
import bg4 from '../images/badge4.svg'

function BadgesList() {

  const ScrollLeft = ()=>{
      var left = document.querySelector(".Home-badgesList")
      left?.scrollBy(-(left?.scrollWidth/6),0)
  }
  const ScrollRight = ()=>{
      var right = document.querySelector(".Home-badgesList")
      right?.scrollBy(right?.scrollWidth/6,0)
  }

return (
    <div className='Home-BadgesList'>
      <div className='contentBadge'>
        <div className='titleBadge'>
          <h2>Badges List</h2>
        </div>
        <div className='Home-badgesScroll'>
          <div className='Home-chevron-left'>
          <button onClick={ScrollLeft}><i className="fa-solid fa-chevron-left"></i></button>
          </div>
          <div className='Home-badgesList'>
            <div className='Home-child'><img src={bg2} alt="" /></div>
            <div className='Home-child'><img src={bg4} alt="" /></div>
            <div className='Home-child'><img src={bg2} alt="" /></div>
            <div className='Home-child'><img src={bg3} alt="" /></div>
            <div className='Home-child'><img src={bg5} alt="" /></div>
            <div className='Home-child'><img src={bg5} alt="" /></div>
          </div>
          <div className='Home-chevron-right'>
          <button onClick={ScrollRight}><i className="fa-solid fa-chevron-right"></i></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BadgesList
