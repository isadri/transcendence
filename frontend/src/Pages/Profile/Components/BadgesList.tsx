import '../styles/BadgesList.css'
import bg5 from '../images/badge5.svg' 
import bg2 from '../images/badge2.svg' 
import bg3 from '../images/badge3.svg' 
import bg4 from '../images/badge4.svg'

function BadgesList() {

  const ScrollLeft = ()=>{
      var left = document.querySelector(".badgesList")
      left?.scrollBy(-125,0);
  }
  const ScrollRight = ()=>{
      var right = document.querySelector(".badgesList")
      right?.scrollBy(125,0);
  }

return (
    <div className='BadgesList'>
      <h2>Badges List</h2>
      <div className='badgesScroll'>
        <div className='chevron-left'>
        <button onClick={ScrollLeft}><i className="fa-solid fa-chevron-left"></i></button>
        </div>
        <div className='badgesList'>
          <div className='child'><img src={bg2} alt="" /></div>
          <div className='child'><img src={bg4} alt="" /></div>
          <div className='child'><img src={bg2} alt="" /></div>
          <div className='child'><img src={bg3} alt="" /></div>
          <div className='child'><img src={bg5} alt="" /></div>
          <div className='child'><img src={bg5} alt="" /></div>
        </div>
        <div className='chevron-right'>
        <button onClick={ScrollRight}><i className="fa-solid fa-chevron-right"></i></button>
        </div>
      </div>
    </div>
  )
}

export default BadgesList
