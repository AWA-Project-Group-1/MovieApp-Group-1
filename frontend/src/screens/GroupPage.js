import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GroupContext from "../context/GroupProvider";
import UserContext from "../context/UserContext";
import styles from "./GroupPage.module.css"; // Updated styles
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const GroupPage = () => {
  const { groups, userGroups, createGroup, joinGroup, leaveGroup, deleteGroup, fetchGroups, fetchUserGroups, fetchGroupDetails } = useContext(GroupContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [joinRequestStatus, setJoinRequestStatus] = useState({});

  useEffect(() => {
    if (user?.id) {
      console.log("Fetching groups for user:", user.id);
      fetchGroups();
      fetchUserGroups(user.id);
    }
  }, [user]);

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      if (user && user.id) {
        createGroup(newGroupName, newGroupDescription, user.id);
        setNewGroupName("");
        setNewGroupDescription("");
      }
    }
  };

  const isJoinRequestSent = (groupId) => {
    return joinRequestStatus[groupId] === "pending";
  };

  const handleJoinGroup = async (groupId) => {
    if (user) {
      await joinGroup(groupId, user.id);
      setJoinRequestStatus(prev => ({ ...prev, [groupId]: "pending" }));
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      await leaveGroup(groupId, user.id);
      alert("You have successfully left the group.");
      navigate("/group");
    } catch (error) {
      console.error("Error leaving group:", error);
      alert("Failed to leave the group");
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!user || !user.id) {
      console.error("User not authenticated or missing user ID.");
      alert("Please log in to delete the group.");
      return;
    }

    try {
      await deleteGroup(groupId, user.id);
      navigate("/group");
    } catch (error) {
      console.error("Error deleting group:", error);
      alert("Failed to delete the group.");
    }
  };

  const createdGroups = userGroups?.owned || [];
  const joinedGroups = userGroups?.joined || [];
  const availableGroups = groups.filter(
    (group) => ![...createdGroups, ...joinedGroups].some(ug => ug.id === group.id)
  );

  const filteredJoinedGroups = joinedGroups.filter(
    (joinedGroup) => !createdGroups.some((createdGroup) => createdGroup.id === joinedGroup.id)
  );

  return (
    <div>
      <Navigation />
      <div className={styles.groupPage}> {/* Scoped class for GroupPage */}
        <h1>Group Page</h1>

        {user ? (
          <>
            {/* Create Group Form */}
            <div className={styles.createGroup}>
              <input
                type="text"
                placeholder="Enter group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
              <textarea
                placeholder="Enter group description"
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
              />
              <button onClick={handleCreateGroup}>Create Group</button>
            </div>

            {/* Groups You Created (Admin Groups) */}
            <h2 className={styles.groupTitle}>Groups You Created</h2>
            <div className={styles.groupList}>
              {createdGroups.length > 0 ? (
                createdGroups.map((group) => (
                  <div key={group.id} className={styles.groupCard}>
                    <h3>{group.name}</h3>
                    <p>{group.description}</p>
                    <button onClick={() => navigate(`/group/${group.id}`)}>View Group</button>
                    <button onClick={() => handleDeleteGroup(group.id)}>Delete Group</button>

                  </div>
                ))
              ) : (
                <p>You haven't created any groups yet.</p>
              )}
            </div>

            {/* Groups You Joined */}
            <h2 className={styles.groupTitle}>Groups You Joined</h2>
            <div className={styles.groupList}>
              {filteredJoinedGroups.length > 0 ? (
                filteredJoinedGroups.map((group) => (
                  <div key={group.id} className={styles.groupCard}>
                    <h3>{group.name}</h3>
                    <button onClick={() => navigate(`/group/${group.id}`)}>View Group</button>
                    <button onClick={() => handleLeaveGroup(group.id)}>Leave Group</button>
                  </div>
                ))
              ) : (
                <p>You haven't joined any groups yet.</p>
              )}
            </div>

            {/* Available Groups */}
            <h2 className={styles.groupTitle}>Available Groups</h2>
            <div className={styles.groupList}>
              {availableGroups.length > 0 ? (
                availableGroups.map((group) => (
                  <div key={group.id} className={styles.groupCard}>
                    <h3>{group.name}</h3>
                    {isJoinRequestSent(group.id) ? (
                      <button disabled>Join Request Sent</button>
                    ) : (
                      <button onClick={() => handleJoinGroup(group.id)}>Join</button>
                    )}
                  </div>
                ))
              ) : (
                <p>No groups available to join.</p>
              )}
            </div>
          </>
        ) : (
          <p>Please log in to manage groups.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default GroupPage;
