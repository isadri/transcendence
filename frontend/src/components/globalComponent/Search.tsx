import axios from "axios";
import { getendpoint } from "../../context/getContextData";
import { useEffect, useRef, useState } from "react";
import { FriendDataType } from "../../context/context";
import { useNavigate } from "react-router-dom";


function Search() {
  const [users, setUsers] = useState<FriendDataType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);

  const navigate = useNavigate();

  const closeMenuRef = useRef<HTMLDivElement>(null);
  const buttonMenuRef = useRef<HTMLDivElement>(null);

  const handleDropdownItemClick = (user: FriendDataType) => {
    // if (user.is_blocked) {
    //   contxt?.setCreatedAlert("This user's profile is blocked, and you cannot access it.");
    //   contxt?.setDisplayed(3);
    // } else {
      navigate(`/profile/${user.username}`);
      setDropdownVisible(false)
    // }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
    setDropdownVisible(e.target.value.length > 0);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const matchingUser = users.find((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (matchingUser) {
      handleDropdownItemClick(matchingUser);
    } 
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        getendpoint("http", "/api/friends/usersRank"),
        {
          withCredentials: true,
        }
      );
      setUsers(response.data);
    } catch (err) {
    }
  };

  useEffect(() => {
    fetchUsers();
    const handleClickOutside = (event: MouseEvent) => {
      if (
        closeMenuRef.current &&
        !closeMenuRef.current.contains(event.target as Node) &&
        buttonMenuRef.current &&
        !buttonMenuRef.current.contains(event.target as Node)
      ) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="Home-searchBar">
      <form action="" className="Home-search" onSubmit={handleFormSubmit}>
        <i className="fa-solid fa-magnifying-glass"></i>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleInputChange}
        />
      </form>
      {dropdownVisible && (
        <div ref={closeMenuRef} className="searchbar-pop-up">
          <div ref={buttonMenuRef} className="allSearchItems">
            {users
              .filter((item) =>
                item.username.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((item, index) => (
                <div
                  key={index}
                  className="searchbar-pop-up-item"
                  onClick={() => handleDropdownItemClick(item)}
                >
                  <div className="searchItem">
                    <img
                      className="img"
                      src={getendpoint("http", item.avatar)}
                      alt=""
                    />
                    {item.username}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;

