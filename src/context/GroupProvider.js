import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api"; // Import the axios instance from api.js
import UserContext from "../context/UserContext.js"; // Import UserContext
const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [groups, setGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [groupDetails, setGroupDetails] = useState(null);
  // Fetch groups from backend using the API instance
  const fetchGroups = async () => {
    try {
      const response = await api.get("/groups"); // Using the API instance with correct base URL
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups", error);
    }
  };
  // Fetch group details by ID
  const fetchGroupDetails = async (groupId) => {
    try {
      const response = await api.get(`/groups/${groupId}`);
      const groupData = response.data;
      groupData.isAdmin = groupData.owners_id === user.id;
      setGroupDetails(groupData);
      return groupData;
    } catch (error) {
      console.error("Error fetching group details", error);
    }
  };

  // Fetch user groups based on user ID
  const fetchUserGroups = async (userId) => {
    try {
      const response = await api.get(`/groups/users/${userId}/groups`);

      // Log the response to inspect its structure
      console.log("Fetched user groups:", response.data);

      // Extract owned and joined groups directly from the response
      const owned = Array.isArray(response.data?.owned) ? response.data.owned : [];
      const joined = Array.isArray(response.data?.joined) ? response.data.joined : [];

      console.log("Fetched owned groups:", owned);
      console.log("Fetched joined groups:", joined);

      // Update userGroups with the fetched owned and joined arrays
      setUserGroups({ owned, joined });
    } catch (error) {
      console.error("Error fetching user groups:", error);
      setUserGroups({ owned: [], joined: [] }); // Set default empty object on error
    }
  };



  // Create a new group       
  const createGroup = async (groupName, groupDescription, userId) => {
    try {
      if (!userId || isNaN(userId)) {
        console.error("Invalid user ID:", userId);
        throw new Error("Invalid user ID");
      }

      const response = await api.post("/groups/create", { name: groupName, description: groupDescription, userId });
      const newGroup = response.data;

      // Update userGroups to add the new group to the 'owned' array
      setUserGroups((prevUserGroups) => ({
        ...prevUserGroups,
        owned: [...prevUserGroups.owned, { ...newGroup, isAdmin: true }],
      }));

      // Optionally refresh groups for the user (if you want to re-fetch)
      fetchUserGroups(userId);
    } catch (error) {
      console.error("Error creating group", error);
    }
  };

  // Join an existing group
  const joinGroup = async (groupId, userId) => {
    try {
      await api.post("/groups/join-request", { groupId, userId });
      fetchUserGroups(userId);  // Refresh user groups after sending request
   
      alert("Request sent to join group successfully");
    } catch (error) {
      console.error("Error joining group", error);
    }
  };
  

  // Leave a group
  const leaveGroup = async (groupId, userId) => {
    try {
      // Send the request to leave the group
      await api.post(`/groups/${groupId}/leave-group`, { userId });
      console.log('Successfully left the group');
      fetchUserGroups(userId); // Refresh user groups after leaving
    } catch (error) {
      alert("Error leaving group", error);
      console.error("Error leaving group", error);
    }
  };


  // Accept a join request
  const acceptJoinRequest = async (groupId, userId) => {
    try {
      await api.post("/groups/accept-request", { groupId, userId, currentUserId: user.id });
      fetchGroupDetails(groupId); // Refresh the group details after accepting
      fetchUserGroups(user.id);   // Make sure user’s joined groups are updated
      alert("Join request accepted");
    } catch (error) {
      console.error("Error accepting join request", error);
      alert("Error accepting join request");
    }
  };


  // Decline a join request
  const declineJoinRequest = async (groupId, userId) => {
    try {
      await api.post("/groups/reject-request", { groupId, userId, currentUserId: user.id });
      fetchGroupDetails(groupId); // Refresh the group details after rejecting
      alert("Join request rejected");
    } catch (error) {
      console.error("Error rejecting join request", error);
      alert("Error rejecting join request");
    }
  };

  // Remove member from group (Only for owners)
  const removeMember = async (groupId, userId, currentUserId) => {
    try {
      await api.post("/groups/remove-member", { groupId, userId, currentUserId });
      fetchGroupDetails(groupId); // Refresh group details after removing member
      fetchUserGroups(currentUserId); // Refresh user groups to reflect changes
    } catch (error) {
      console.error("Error removing member:", error);
      alert("Error removing member");
    }
  };

  //deleting group
  const deleteGroup = async (groupId, userId) => {
    try {
      // Send the delete request to the backend
      await api.delete(`/groups/${groupId}?userId=${userId}`);
      alert("Group deleted successfully.");
  
      // Remove the group from the local state without needing to refresh
      setGroups((prevGroups) => prevGroups.filter((group) => group.id !== groupId));
  
      // Optionally, fetch updated user groups after deletion
      fetchUserGroups(userId);
    } catch (error) {
      console.error("Error deleting group:", error);
      alert("Failed to delete the group.");
    }
  };
  
 //  Add a movie to a group
 const addMovieToGroup = async (groupId, movie) => {
  try {
    // Send a POST request to add the movie to the group
    const response = await api.post(`api/groups/${groupId}/add-movie`, movie);
    console.log('Response from backend:', response.data); // Log the response to check its structure

    const updatedGroup = response.data;

    // Update the group details in state if it matches the current group
    if (groupDetails?.id === groupId) {
      setGroupDetails((prevDetails) => ({
        ...prevDetails,
        movies: [...prevDetails.movies, movie], // Add the new movie to the group's movie list
      }));
    }

    return updatedGroup;
  } catch (error) {
    console.error("Error adding movie to group:", error);
    throw new Error("Failed to add movie to the group");
  }
}; 


  // Fetch groups when the component mounts
  useEffect(() => {
    fetchGroups();  // Ensure fetchGroups is called on mount
  }, []);

  return (
    <GroupContext.Provider
      value={{
        groups,
        userGroups,
        createGroup,
        joinGroup,
        leaveGroup,
        acceptJoinRequest,
        declineJoinRequest,
        removeMember,
        fetchGroups,  // Make sure fetchGroups is passed here
        fetchUserGroups,
        fetchGroupDetails,
        deleteGroup,
        addMovieToGroup,

      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export default GroupContext;
