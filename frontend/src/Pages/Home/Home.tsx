import './Home.css'

function Home() {
  return (
    <div className='homePage'>
      <div className='searchBar'>
        <form action="">
        <i className="fa-solid fa-magnifying-glass"></i>
          <input type="search" placeholder="Search..." />
        </form>
        <div className='Icons'>
          <i className="fa-solid fa-bell"></i>
          <i className="fa-solid fa-user-plus"></i>
        </div>
      </div>
    </div>
  )
}

export default Home
