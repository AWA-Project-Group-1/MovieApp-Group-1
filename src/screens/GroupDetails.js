import React, { useState, useEffect } from "react";
import ContentList from "../components/ContentList";
import AddContent from "../components/AddContent";
import AddMovie from "../components/AddMovie";
import AddShowtime from "../components/AddShowtime";
import ManageGroup from "../components/ManageGroup";
import { useParams } from "react-router-dom";
import useUser from "../context/useUser";
import axios from "axios";
import "./GroupDetails.css";

const GroupDetails = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [role, setRole] = useState(null); // Trạng thái quyền hạn của người dùng
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id: groupId } = useParams();
  const { user } = useUser();

  const handleJoin = async () => {
    try {
      await axios.post(`http://localhost:3001/manage/${groupId}/join`, {
        userId: user.id,
      });
      alert("Join request sent successfully!");
    } catch (err) {
      console.error("Error sending join request:", err);
      alert("Failed to send join request.");
    }
  };

  const handleLeave = async () => {
    try {
      await axios.delete(`http://localhost:3001/manage/${groupId}/${user.id}`);
      alert("You have left the group.");
    } catch (err) {
      console.error("Error leaving group:", err);
      alert("Failed to leave the group.");
    }
  };

  useEffect(() => {
    const fetchRole = async () => {
      try {
        if (user) {
          const response = await axios.get(
            `http://localhost:3001/content/${groupId}/${user.id}/permissions`
          );
          setRole(response.data.role);
        } else {
          setRole("none");
        }
      } catch (err) {
        console.error("Error fetching role:", err);
        setError("Failed to check user permissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [groupId, user]);

  if (!groupId) {return <div>Group ID is missing!</div>;}
  if (loading) {return <div>Loading...</div>;}
  if (error) {return <div style={{ color: "red" }}>{error}</div>;}
  const isOwnerOrMember = role === "owner" || role === "member";

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Group Content</h2>
      <nav style={{ marginBottom: "20px" }}>
        <a href="#!" onClick={() => setActiveTab("list")} style={{ marginRight: "10px" }}>
          View Content
        </a>
        <a
          href="#!"
          onClick={() => isOwnerOrMember && setActiveTab("addContent")}
          style={{
            marginRight: "10px",
            color: isOwnerOrMember ? "blue" : "gray",
            pointerEvents: isOwnerOrMember ? "auto" : "none",
          }}
        >
          Add Content
        </a>
        <a
          href="#!"
          onClick={() => isOwnerOrMember && setActiveTab("addMovie")}
          style={{
            marginRight: "10px",
            color: isOwnerOrMember ? "blue" : "gray",
            pointerEvents: isOwnerOrMember ? "auto" : "none",
          }}
        >
          Add Movies
        </a>
        <a
          href="#!"
          onClick={() => isOwnerOrMember && setActiveTab("addShowtime")}
          style={{
            color: isOwnerOrMember ? "blue" : "gray",
            pointerEvents: isOwnerOrMember ? "auto" : "none",
          }}
        >
          Add Show Time
        </a>


        {role === "owner" && (
          <button onClick={() => setActiveTab("manage")} style={{ marginLeft: "10px" }}>
            Manage Group
          </button>
        )}
        
        
        {role === "member" && (
            <button onClick={handleLeave} style={{ marginLeft: "10px", color: "red" }}>
              Leave Group
            </button>
        )}

        {role === "none" && user && (
          <button onClick={handleJoin} style={{ marginLeft: "10px", color: "white" }}>
            Join Group
          </button>
        )}
      </nav>

      {activeTab === "list" && <ContentList groupId={parseInt(groupId)} />}
      {activeTab === "addContent" && <AddContent groupId={parseInt(groupId)} />}
      {activeTab === "addMovie" && <AddMovie groupId={parseInt(groupId)} />}
      {activeTab === "addShowtime" && <AddShowtime groupId={parseInt(groupId)} />}
      {activeTab === "manage" && role === "owner" && <ManageGroup groupId={parseInt(groupId)} />}
    </div>
  );
};

export default GroupDetails;
