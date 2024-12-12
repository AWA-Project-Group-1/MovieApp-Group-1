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
const GroupDetailsPage = ({ groupId }) => {
  const { id } = useParams(); // Get the group ID from the URL
  const { fetchGroupDetails, removeMember, acceptJoinRequest, declineJoinRequest, leaveGroup, deleteGroup, addMovieToGroup } = useContext(GroupContext);
  const { user } = useContext(UserContext); // Access user context
  const [group, setGroup] = useState(null);

  const navigate = useNavigate();

  // Fetch the group details when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const groupData = await fetchGroupDetails(id); // Fetch details by group ID
      setGroup(groupData);
    };
    fetchData();
  }, [id, fetchGroupDetails]);


  // heyanwen has added for the search functionality , add fnctionality and display functionality

  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [groupMovie, setGroupMovie] = useState([]);

  const movieTVSerialData = useContext(MoiveTVSerialContext);


  const fetchMovies = async (groupId) => {
    try {
      // Use axios to make the GET request to fetch the movies for the group
      const response = await api.get(`/groups/${groupId}/movies`);

      // Check if the fetch request is successful
      if (response.status === 200) {
        const uniqueMovies = response.data.movies.filter((movie, index, self) =>
          index === self.findIndex((m) => m.id === movie.id)
        );
        setGroupMovie(uniqueMovies);
        console.log(`This is the response.data.movies  : ${uniqueMovies}`)
      } else {
        alert("Failed to fetch movie list.");
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      alert("Failed to fetch movie list. Please try again.");
    }
  };

  // Use effect to fetch group and movie data when groupId changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupResponse = await api.get(`/groups/${groupId}`);
        setGroup(groupResponse.data);
        fetchMovies(groupId);
      } catch (error) {
        console.error('Error fetching group details:', error);
        alert('Failed to fetch group details.');
      }
    };

    if (groupId) {
      fetchData();
    }
  }, [groupId]);

  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearch = () => {
    setSearchPerformed(true);
  };

  // Filter movies based on the search query
  const filteredTVMovies = movieTVSerialData.tvSeries?.filter((tvShow) =>
    searchInput ? tvShow.name.toLowerCase().includes(searchInput.toLowerCase()) : true
  ) || [];

  // Filter Movies
  const filteredMovies = movieTVSerialData.movies?.filter((movie) =>
    searchInput ? movie.title.toLowerCase().includes(searchInput.toLowerCase()) : true
  ) || [];


  const combinedFilteredResults = filteredTVMovies
    .map((tvShow) => ({ ...tvShow, name: tvShow.name }))
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
        title: movie.name,
        description: movie.overview,
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
  // /:groupId/delete-movies/:movieId
  const handleDelete = async (movieId) => {
    const userId = user.id;
    try {
      const response = await api.delete(`/groups/${groupId}/delete-movies/${movieId}`, {
        data: { userId }, // Include userId in the request body
      });
      if (response.data.success) {
        alert('Movie deleted successfully!');
        groupMovie(); // Call to refresh the movies after deletion
      } else {
        alert(response.data.message || 'Failed to delete movie.');
      }
    } catch (error) {
      console.error('Error deleting movie:', error.message);
      alert('An error occurred while deleting the movie.');
    }
  };






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
    <div className={styles["whole-container"]}>
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

          {searchPerformed ? (
            uniqueFilteredMovies.length === 0 ? (
              <p>No movies or TV series found.</p>
            ) : (
              uniqueFilteredMovies.map((item) => (
                <div key={item.id || item.name} className={styles['searchedmovie-container']}>
                  <h1>Movies Searched for Group: {group.name}</h1>
                  <div className={styles['productcards_container']}>
                    <div className={styles['product-card-framework']}>
                      <div className={styles['image-container']}>
                        <img
                          className={styles['product-card']}
                          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                          alt={item.name || item.title || "Untitled"}
                        />
                      </div>
                      <div className={styles['text-container']}>
                        <h5>
                          {item.name?.length > 17
                            ? `${item.name.slice(0, 17)}...`
                            : item.title?.length > 17
                              ? `${item.title.slice(0, 17)}...`
                              : item.name || item.title || "Untitled"}
                        </h5>
                        <p>
                          {item.overview
                            ? `${item.overview.slice(0, 17)}...`
                            : "No description"}
                        </p>
                        <div className={styles['button-container']}>
                          <button onClick={(e) => handleAddMovieToGroup(e, item)} className={styles['button-click']}>
                            Add to Group List
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )
          ) : (
            <div className={styles['reminder-container']}>
              <p>Please enter a search term to find movies or TV series.</p>
            </div>
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
                      <h5>
                        {(movie.movie_title && movie.movie_title.length > 17)
                          ? `${movie.movie_title.slice(0, 17)}...`
                          : (movie.movie_title && movie.movie_title.length > 17)
                            ? `${movie.movie_title.slice(0, 17)}...`
                            : movie.movie_title || movie.movie_title}
                      </h5>
                      {/* <h5>{movie.movie_title.length > 17 ? `${movie.movie_title.slice(0, 17)}...` : movie.movie_title}</h5> Update the title field name */}
                      {/* <p>{movie.first_air_date || movie.release_date}</p> */}
                      <p>
                        {movie.post_content
                          ? `${movie.post_content.slice(0, 17)}...`
                          : "No description"}
                      </p>

                      <div className={styles['addfavourites-button-container']}>
                        < button className={styles['button-click']} onClick={() => handleDelete(movie.movie_id)}>
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
            <button onClick={() => handleDeleteGroup(group.id)}>Delete Group</button>
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
