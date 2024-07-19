import { useState, useEffect, useRef } from "react";
import Pagination from "./Pagination.js";
import Users from "./Users.js";
import "./styles.css";

export default function App() {
  const [randomUsers, setRandomUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(1);
  const renderAfterCalled = useRef(false);

  // Limit the amount of times UseEffect is called with dependancy and ref especially with strict mode on for my sanity
  useEffect(() => {
    if (!renderAfterCalled.current) {
      getUserData();
    }
    renderAfterCalled.current = true;
  }, [loading]);

  // Call to data source and simple validation check
  async function getUserData() {
    try {
      await fetch("https://randomuser.me/api/?page=3&results=10").then(
        (response) =>
          response.json().then((users) => {
            console.log("res", users.results);
            // Check for valid users array as response is inconsistent
            const data =
              users && users.results && users.results.length > 0
                ? users.results
                : [];
            // Format User and set to state
            formatUserData(data);

            // Handle excess ui renders
            setLoading(true);
          })
      );
    } catch (error) {
      console.error(error.message);
    }
  }

  // Function to format only the data required to be rendered and add this data to state
  const formatUserData = (data) => {
    const formattedUsers = data.map((user) => {
      const { name, email, picture } = user;
      let userName = `${name.first} ${name.last}`;
      let pictureThumbnail = picture.thumbnail;

      return {
        userName,
        email,
        pictureThumbnail,
      };
    });

    setRandomUsers(formattedUsers);
  };

  // Handle pagination calculations
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = randomUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="App">
      <h1>Potential Candidates for Software Developer Role</h1>
      <Users data={currentUsers} />
      <Pagination
        usersPerPage={usersPerPage}
        length={randomUsers.length}
        handlePagination={handlePagination}
        currentPage={currentPage}
      />
    </div>
  );
}
