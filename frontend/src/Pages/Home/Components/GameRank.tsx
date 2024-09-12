import '../styles/GameRank.css'
import photo from '../images/profile.svg'
import bg1 from '../images/badge1.svg'

function GameRank() {
  return (
    <div className='GameRank'>
      <h2>Game Rank</h2>
      <table className='table'>
        <tr className="RowHeader">
            <th className="row">Rank</th>
            <th className="row">Badge</th>
            <th className="row">Player</th>
            <th className="row">Points</th>
            <th className="row">Level</th>
        </tr>
        <tr className='RowEle'>
          <td>1</td>
          <td className='row'>
            <img src={bg1} alt="" />
          </td>
          <td className='row'>
            <img  className="Pimg" src={photo} alt="" />
            <p>user1</p>
          </td>
          <td className='row'>
            <p>1425 xp</p>
          </td>
          <td className='row'> 5.22 </td>
        </tr>
        <tr className='RowEle'>
          <td>1</td>
          <td className='row'>
            <img src={bg1} alt="" />
          </td>
          <td className='row'>
            <img  className="Pimg" src={photo} alt="" />
            <p>user1</p>
          </td>
          <td className='row'>
            <p>1425 xp</p>
          </td>
          <td className='row'> 5.22 </td>
        </tr>
        <tr className='RowEle'>
          <td>1</td>
          <td className='row'>
            <img src={bg1} alt="" />
          </td>
          <td className='row'>
            <img  className="Pimg" src={photo} alt="" />
            <p>user1</p>
          </td>
          <td className='row'>
            <p>1425 xp</p>
          </td>
          <td className='row'> 5.22 </td>
        </tr>
      </table>
    </div>
  )
}

export default GameRank
