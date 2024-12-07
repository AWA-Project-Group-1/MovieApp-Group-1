import React, { useState } from "react";
import useUser from '../context/useUser.js';
import axios from 'axios';

const AddContent = ({ groupId }) => {
  const [postContent, setPostContent] = useState("");
  const { user } = useUser(); // Lấy thông tin user từ context

  const handleSubmit = (e) => {
    e.preventDefault();

    const headers = {headers: {'Content-Type': 'application/json', Authorization: `Bearer ${user.token}`}};
    axios.post(`/content/${groupId}/content`, {
            userId: user.id,
            postContent: postContent,
            }, headers)
      .then((response) => response.json())
      .then(() => alert("Content added successfully"))
      .catch((error) => console.error("Error:", error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Content</h3>
      <textarea
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        placeholder="Enter content here..."
        rows="10"
        style={{ width: "100%" }}
      ></textarea>
      <button type="submit">Submit</button>
    </form>
  );
};

export default AddContent;