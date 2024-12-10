import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GroupContext from "../context/GroupProvider";
import UserContext from "../context/UserContext"; // Import UserContext to get current user
import styles from "./GroupDetailsPage.module.css"; // Add your styles
// import Footer from "./Footer";
import Navigation from './Navigation';
import Footer from "../components/Footer"

const GroupDetailsPage = () => {
  const { id } = useParams(); // Get the group ID from the URL
  const { fetchGroupDetails, removeMember, acceptJoinRequest, declineJoinRequest, leaveGroup, deleteGroup } = useContext(GroupContext);
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
      <Navigation />


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
};

export default GroupDetailsPage;
