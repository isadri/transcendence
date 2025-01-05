import '../styles/BadgesList.css'
import bg1 from '../images/badges/bg1.svg'
import bg2 from '../images/badges/bg2.svg' 
import bg3 from '../images/badges/bg3.svg' 
import bg4 from '../images/badges/bg4.svg'
import bg5 from '../images/badges/bg5.svg' 
import { useEffect } from 'react'
import { UserData } from '../Profile'


interface Prop {
  userData: UserData
}
function BadgesList({userData}: Prop) {

  const ScrollLeft = ()=>{
      var left = document.querySelector(".Home-badgesList")
      left?.scrollBy(-(left?.scrollWidth/7),0)
  }
  const ScrollRight = ()=>{
      var right = document.querySelector(".Home-badgesList")
      right?.scrollBy(right?.scrollWidth/7,0)
    }
  useEffect((() => {
    var badge = document.querySelector(".Home-badgesList")
    badge?.scroll(badge?.scrollWidth/7 * userData.stats.badge ,0)
  }),[])
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
            <div className={`Home-child ${0 <= userData.stats.badge ? "showBadge": "hadeBadge" } `}><img src={bg1} alt="" /></div>
            <div className={`Home-child ${1 <= userData.stats.badge ? "showBadge": "hadeBadge" } `}><img src={bg2} alt="" /></div>
            <div className={`Home-child ${2 <= userData.stats.badge ? "showBadge": "hadeBadge" } `}><img src={bg3} alt="" /></div>
            <div className={`Home-child ${3 <= userData.stats.badge ? "showBadge": "hadeBadge" } `}><img src={bg4} alt="" /></div>
            <div className={`Home-child ${4 <= userData.stats.badge ? "showBadge": "hadeBadge" } `}><img src={bg5} alt="" /></div>
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
