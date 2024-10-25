import CreatorsData from './AboutUsData'
import './AboutUs.css'


function AboutUs() {
  return (
    <div className='AboutUs'>
        <div className='AboutUs-intro'>
            <h1>OUR TEAM</h1>
            <span>Get to know the creators responsible for this Ping Pong game platform...</span>
        </div>
        <div className='AboutUs-comp'>
            <div className='AboutUs-team'>
                {CreatorsData.map((item) => (
                    <div className='AboutUs-Creator' key={item.id}>
                    <div className='AboutUs-CreatorInfo'>
                        <span>{item.name}</span>
                        <span>{item.specialty}</span>
                        <div className='AboutUs-CreatorContact'>
                            {item.icons[0]}
                            {item.icons[1]}
                        </div>
                    </div>
                    {item.img}
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default AboutUs
