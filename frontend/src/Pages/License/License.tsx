import './License.css'
import ToolsData from './LicenseData'

function License() {
  return (
    <div className='license-Parent'>
      <div className='license-text'>
        <h1>Tools & Technologies</h1>
        <span>Explore the tools and tech behind this Ping Pong game platform...</span>
      </div>
      <div className='License-elements'>
        {ToolsData.map((tool) => (
          <div className="License-item"key={tool.id}>
            {tool.img}
            <h2>{tool.name}</h2>
            <p>{tool.info}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default License
