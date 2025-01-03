import React from 'react'
import '../styles/StatsProfile.css'
function StatsProfile() {
  return (
    <div className='state-profile'>
        <h2>Stats</h2>
        <div className='statsProfile-content'>
          <div className='total'>
            <h4>Total Games</h4>
            <span>10</span>
          </div>
          <div className='wins'>
              <h4>Wins</h4>
            <span>5</span>
          </div>
          <div className='loss'>
            <h4>Loss</h4>
            <span>5</span>
          </div>
        </div>
    </div>
  )
}

export default StatsProfile