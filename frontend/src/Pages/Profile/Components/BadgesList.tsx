import '../styles/BadgesList.css'
import bg5 from '../images/badge5.svg' 
import bg2 from '../images/badge2.svg' 
import bg3 from '../images/badge3.svg' 
import bg4 from '../images/badge4.svg'

function BadgesList() {
  return (
    <div className='BadgesList'>
      <h2>Badges List</h2>
      <div className='badgesScroll'>
        <div className='chevron-left'>
        <i className="fa-solid fa-chevron-left"></i>
        </div>
        <div className='badgesList'>
          <img src={bg2} alt="" />
          <img src={bg4} alt="" />
          <img src={bg2} alt="" />
          <img src={bg3} alt="" />
          <img src={bg5} alt="" />
          <img src={bg5} alt="" />
          <img src={bg5} alt="" />
        </div>
        <div className='chevron-right'>
        <i className="fa-solid fa-chevron-right"></i>
        </div>
      </div>
    </div>
  )
}

export default BadgesList
