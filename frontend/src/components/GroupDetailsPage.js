import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GroupContext from "../context/GroupProvider";
import UserContext from "../context/UserContext"; // Import UserContext to get current user
import styles from "./GroupDetailsPage.module.css"; // Add your styles
// import Footer from "./Footer";
import Navigation from './Navigation';
import Footer from "../components/Footer"
// import TVCards from "../components/TVCards"
// import MovieCards from "../components/MovieCards";
import { MoiveTVSerialContext } from "../context/MoiveTVSerialProvider"
import { RiAlignItemBottomLine } from "react-icons/ri";
import api from "../services/api";
const GroupDetailsPage = () => {
  const { id:groupId } = useParams(); // Get the group ID from the URL
  const { fetchGroupDetails, removeMember, acceptJoinRequest, declineJoinRequest, leaveGroup, deleteGroup,  addMovieToGroup } = useContext(GroupContext);
  const { user } = useContext(UserContext); // Access user context
  const [group, setGroup] = useState(null);
  const movieTVSerialData = useContext(MoiveTVSerialContext);
  const navigate = useNavigate();

 
const [searchPerformed, setSearchPerformed] = useState(false); 
const [searchInput, setSearchInput] = useState("");
const [groupMovie, setGroupMovie] = useState([]);
const [noMoviesMessage, setNoMoviesMessage] = useState("");  // Message when no movies



const fetchMovies = async (groupId) => {
  try {
    // Use axios to make the GET request to fetch the movies for the group
    const response = await api.get(`/groups/${groupId}/movies`);

    // Check if the fetch request is successful
    if (response.status === 200) {
      // Update the group movie list with the fetched movies
      const uniqueMovies = response.data.movies.filter((movie, index, self) =>
        index === self.findIndex((m) => m.id === movie.id)
      );

      // If no movies are found, set the message
      if (uniqueMovies.length === 0) {
        setNoMoviesMessage("No movies available for this group.");
      } else {
        setNoMoviesMessage("");  // Reset message if movies exist
      }

      setGroupMovie(uniqueMovies);
      console.log(`Fetched unique movies: ${uniqueMovies}`);
    } else {
      alert("Failed to fetch movie list. Response status: " + response.status);
    }
  } catch (error) {
    console.error("Error fetching movies:", error);

    // Check if the error is due to a 404 (meaning no movies are found) or any other network-related issue
    if (error.response && error.response.status === 404) {
      setNoMoviesMessage("No movies available for this group.");
    } else {
      alert("Failed to fetch movie list. Please try again.");
    }
  }
};

// Fetch group details and movie data when groupId changes
useEffect(() => {
  const fetchData = async () => {
    if (!groupId) {
      console.error("Group ID is undefined or null.");
      return;
    }
    try {
      const groupData = await fetchGroupDetails(groupId); // Fetch group details
      setGroup(groupData);
      await fetchMovies(groupId); // Fetch movies after group details
    } catch (error) {
      console.error("Error fetching group data or movies:", error);
    }
  };
  fetchData();
}, [groupId, fetchGroupDetails]);

const handleInputChange = (event) => {
  setSearchPerformed(false);
  setSearchInput(event.target.value); 
};

const handleSearch = () => {
  setSearchPerformed(true); // Mark that a search has been performed
};

// Filter movies based on the search query
// Filter TV Series
const filteredTVMovies = movieTVSerialData.tvSeries?.filter((tvShow) =>
  searchInput ? tvShow.name.toLowerCase().includes(searchInput.toLowerCase()) : true
) || [];

// Filter Movies
const filteredMovies = movieTVSerialData.movies?.filter((movie) =>
  searchInput ? movie.title.toLowerCase().includes(searchInput.toLowerCase()) : true
) || [];

// Normalize properties to "name" and combine results
const combinedFilteredResults = filteredTVMovies
  .map((tvShow) => ({ ...tvShow, name: tvShow.name })) // Ensure TV series have "name"
  .concat(filteredMovies.map((movie) => ({ ...movie, name: movie.title }))); // Map movie title to "name"

// Remove duplicates based on the "id" and "name"
const uniqueFilteredMovies = combinedFilteredResults.filter(
  (item, index, self) =>
    index === self.findIndex((t) => t.id === item.id && t.name === item.name)
);

const handleAddMovieToGroup = async (e, movie) => {
  e.preventDefault();
  try {
    const userId = user.id; // Assume available in context or state
    const groupId = group.id; // Assume available in context or state

    console.log("User ID:", userId);
    console.log("Group ID:", groupId);

    const movieData = {
      userId: userId,
      groupId: groupId,
      movieId: movie.id,
      title : movie.name,
      description: "", // Optional
      posterPath: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    };

    // Use axios to make the POST request
    const response = await api.post(`/groups/${groupId}/add-movie`, movieData);

    console.log("Movie Data:", movieData);

    // Check if the response is successful
    if (response.status !== 201) {
      throw new Error("Failed to add movie to group");
    }

    // Update the group movie list
    // setGroupMovie((prevMovies) => [...prevMovies, response.data.movie]);
    fetchMovies(groupId); 
    alert("Movie added successfully!");
  } catch (error) {
    if (error.response) {
      // API specific error
      console.error("API Error:", error.response.data);
      alert(error.response.data.message || "Failed to add movie to the group.");
    } else {
      // Network error or other issues
      console.error("Error adding movie to group:", error.message);
      alert("Failed to add movie to the group. Please try again.");
    }
  }

}







  if (!group) return <p>Loading...</p>; // Loading state while fetching data

  // Check if the current user is the owner
  const isOwner = group.owners_id === user.id;

  // Handle remove member action
  const handleRemoveMember = async (memberId) => {
    try {
      // Pass the groupId, memberId (userId), and currentUserId (the admin's ID) to remove the member
      await removeMember(group.id, memberId, user.id);
      // Update the UI to remove the member
      setGroup((prevGroup) => ({
        ...prevGroup,
        members: prevGroup.members.filter((member) => member.id !== memberId),
      }));
      alert("Member removed successfully");
    } catch (error) {
      console.error("Error removing member:", error);
      alert("Failed to remove member");
    }
  };
  const handleLeaveGroup = async (groupId) => {
    try {
      // Call the leaveGroup function from the context with the specific groupId
      await leaveGroup(groupId, user.id);
      // Redirect the user to the groups page or show a success message
      alert("You have successfully left the group.");
      navigate("/group"); // Move navigation here after the group is successfully left
    } catch (error) {
      console.error("Error leaving group:", error);
      alert("Failed to leave the group");
    }
  };
  // Handle deleting a group
  const handleDeleteGroup = async (groupId) => {
    try {
      // Call the deleteGroup function from the context with the specific groupId
      await deleteGroup(groupId, user.id);
      navigate("/group"); // Redirect the user to the groups page after successful deletion
    } catch (error) {
      console.error("Error deleting group:", error);
      alert("Failed to delete the group.");
    }
  }

  return (
    <div>
            <div>
                <Navigation />
            </div>
          


            <div className={styles.container}>
              <h1>{group.name}</h1>
              <p>{group.description}</p>

              <h3>Members</h3>
              <ul>
                {group.members.length > 0 ? (
                  group.members.map((member) => (
                    <li key={member.id}>
                      {member.email} {member.role === 'admin' && <span>(Admin)</span>}
                      {/* Show "Remove Member" button only for admin */}
                      {isOwner && member.id !== user.id && (
                        <button onClick={() => handleRemoveMember(member.id)}>Remove Member</button>
                      )}
                    </li>
                  ))
                ) : (
                  <p>No members yet.</p>
                )}
              </ul>

                {/* Display join requests only if the current user is the owner */}
                {isOwner && (
                  <>
                    <h3>Pending Join Requests</h3>
                    <ul>
                      {group.joinRequests.length > 0 ? (
                        group.joinRequests.map((request) => (
                          <li key={request.request_id}>
                            <p>{request.users_email} (Pending)</p>
                            <button onClick={() => acceptJoinRequest(group.id, request.users_id)}>Accept</button>
                            <button onClick={() => declineJoinRequest(group.id, request.users_id)}>Decline</button>
                          </li>
                        ))
                      ) : (
                        <p>No pending requests.</p>
                      )}
                    </ul>
                  </>
                )}

                {/* Admin Delete Button */}
                  <div className={styles["delete-leave-back-button-container"]}>
                      {/* Search input and button  he added*/}
                      <div className={styles["input-button-container"]}>
                         <div className={styles["input-container"]}>
                          <input 
                                value={searchInput} // Set the value to the searchInput state
                                onChange={handleInputChange} // Update state when user types
                                placeholder="Search movies or tv "
                              />
                         </div>
                          
                            <button onClick={handleSearch}>Search</button>
                           
                            
                      </div>
                          
                      {uniqueFilteredMovies.length > 0 ? (
                        <div className={styles['searchedmovie-container']}> 
                          <h1>Movies Searched for Group: {group.name}</h1>
                          
                          <div className={styles['productcards_container']}>
                            {searchPerformed ? (
                              uniqueFilteredMovies.length === 0 ? (
                                <p>No movies or TV series found.</p>
                              ) : (
                                // Display filtered movies
                                uniqueFilteredMovies.map((item) => (
                                  <div
                                    key={`${item.id}-${item.name}`} // Combine id and name to ensure uniqueness
                                    className={styles['product-card-framework']}
                                  >
                                    <div className={styles['image-container']}>
                                      <img
                                        className={styles['product-card']}
                                        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                                        alt={item.name}
                                      />
                                    </div>
                                    <div className={styles['text-container']}>
                                      <h5>{item.name.length > 17 ? `${item.name.slice(0, 17)}...` : item.name}</h5>
                                      <p>{item.first_air_date}</p>
                                      <div className={styles['button-container']}>
                                        <div className={styles['addfavourites-button-container']}>
                                          <button onClick={(e) => handleAddMovieToGroup(e, item)} className={styles['button-click']}>
                                            Add to Group List
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              )
                            ) : (
                              <div className={styles['reminder-container']}>
                                <p >Please enter a search term to find movies or TV series.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        // When there are no filtered movies to display
                        <p>No movies found for this group.</p>
                      )}
          


              

           
              

              {groupMovie.length > 0 ? (
                  <div className={styles['searchedmovie-container']}>
                    <h1>Movie List for Group: {group.name}</h1>
                    
                    {/* Render the list of movies */}
                    <div className={styles['productcards_container']}>
                      {groupMovie.map((movie) => (
                        <div key={movie.id} className={styles['product-card-framework']}>
                          <div className={styles['image-container']}>
                            <img
                              className={styles['product-card']}
                              src={movie.movie_poster_path} // Update the image path field name
                              alt={movie.movie_title} // Update the title field name
                            />
                          </div>
                          <div className={styles['text-container']}>
                          {/* {item.name.length > 17 ? `${item.name.slice(0, 17)}...` : item.name} */}
                            <h5> {movie.movie_title.length > 17 ? `${movie.movie_title.slice(0, 17)}...` : movie.movie_title}</h5> {/* Update the title field name */}
                            {/* <p>{movie.post_content || "No description available."}</p> Update the description field */}
                            <div className={styles['addfavourites-button-container']}>
                              <button onClick={(e) => handleAddMovieToGroup(e, movie)} className={styles['button-click1']}>
                                Delete Movie
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Add a message or a placeholder when no movies are in the group
                  <p>No movies for your group.</p>
                )}

         
           
              {isOwner && (
                <button  onClick={() => handleDeleteGroup(group.id)}>Delete Group</button>
              )}

              {/* Member Leave Group Button */}
              {!isOwner && (
                <button onClick={() => handleLeaveGroup(group.id)}>Leave Group</button>
              )}

              <button onClick={() => navigate("/group")}>Back to Groups</button>
          </div>

          </div>
     
      <Footer />
 
    </div>
    
  );

}
export default GroupDetailsPage;
