import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";

axios.defaults.baseURL = 'http://localhost:3001';

const ManageGroup = ({ groupId }) => {
  const [joinRequests, setJoinRequests] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGroupManagementData = useCallback(async () => {
    try {
      const response = await axios.get(`/manage/${groupId}/manage`);
      setJoinRequests(response.data.requests);
      setMembers(response.data.members);
    } catch (err) {
      console.error("Error fetching management data:", err);
      setError("Failed to load group management data.");
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  const handleAccept = async (userId) => {
    try {
      await axios.patch(`/manage/${groupId}/${userId}`, {
        action: "accept",
      });
      alert("Request accepted!");
      fetchGroupManagementData();
    } catch (err) {
      console.error("Error accepting request:", err);
      alert("Failed to accept request.");
    }
  };

  const handleReject = async (userId) => {
    try {
      await axios.patch(`/manage/${groupId}/${userId}`, {
        action: "reject",
      });
      alert("Request rejected!");
      fetchGroupManagementData();
    } catch (err) {
      console.error("Error rejecting request:", err);
      alert("Failed to reject request.");
    }
  };

  const handleRemove = async (userId) => {
    try {
      await axios.delete(`/manage/${groupId}/${userId}`);
      alert("Member removed!");
      fetchGroupManagementData();
    } catch (err) {
      console.error("Error removing member:", err);
      alert("Failed to remove member.");
    }
  };

  useEffect(() => {
    fetchGroupManagementData();
  }, [fetchGroupManagementData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h3>Manage Group</h3>

      <h4>Join Requests</h4>
      {joinRequests.length > 0 ? (
        <ul>
          {joinRequests.map((request) => (
            <li key={request.users_id}>
              {request.users_id} - Pending
              <button onClick={() => handleAccept(request.users_id)} style={{ marginLeft: "10px" }}>
                Accept
              </button>
              <button onClick={() => handleReject(request.users_id)} style={{ marginLeft: "10px" }}>
                Reject
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No join requests.</p>
      )}

      <h4>Members</h4>
      {members.length > 0 ? (
        <ul>
          {members.map((member) => (
            <li key={member.users_id}>
              {member.users_id} - Member
              <button onClick={() => handleRemove(member.users_id)} style={{ marginLeft: "10px" }}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No members yet.</p>
      )}
    </div>
  );
};

export default ManageGroup;
