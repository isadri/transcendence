import axios from "axios";
import { getContext, getendpoint } from "../../context/getContextData";
import { useEffect, useState } from "react";
import { FriendDataType } from "../../context/context";
import { useNavigate } from "react-router-dom";
import { div } from "three/webgpu";



function Search() {
  const [users, setUsers] = useState<FriendDataType[]>([])

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);

  // const authUser = getUser()
  const contxt = getContext()
  const navigate = useNavigate();

  const usersProfile = (user : FriendDataType) => {
    if (user.is_blocked){
      contxt?.setCreatedAlert("This user's profile is blocked, and you cannot access it.")
      contxt?.setDisplayed(3)
    }
    else
      navigate(`/profile/${user.username}`)
  }
  const handleInputChange = (e: any): void => {
    setSearchTerm(e.target.value);
    setDropdownVisible(e.target.value.length > 0);
  };

  const handleDropdownItemClick = (item: string): void => {
    setSearchTerm(item);
    setDropdownVisible(false);
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        getendpoint("http", "/api/friends/usersUnfriends"),
        // "http://0.0.0.0:8000/api/friends/users",
        {
          withCredentials: true,
        }
      );
      setUsers(response.data);
    } catch (err) {
      console.log("Error fetching users:", err);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [])
  return (
    <div className="Home-searchBar">
      <form action="" className='Home-search' onSubmit={handleInputChange}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <input type="search" placeholder="Search..." value={searchTerm}
          onChange={handleInputChange}/>
      </form>
      {dropdownVisible && (
        <div className="searchbar-pop-up">
          < div  className="allSearchItems">
          {users
            .filter((item) => item.username.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((item, index) => (
                <div key={index} className="searchbar-pop-up-item"
                  onClick={() => handleDropdownItemClick(item.username)}>
                  <div className="searchItem"  onClick={() => usersProfile(item)}>
                      <img className="img" src={getendpoint("http", item.avatar)} alt=""
                      />
                  {item.username}
                  </div>
                </div>
            ))}
            </div>
        </div>
      )}
    </div>
  )
}

export default Search
