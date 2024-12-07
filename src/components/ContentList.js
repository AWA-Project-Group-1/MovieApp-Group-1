import React, { useState, useEffect } from "react";
import axios from "axios";

const url = "http://localhost:3001";

const ContentList = ({ groupId }) => {
  const [contents, setContents] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(true); // Để hiển thị trạng thái đang tải
  const [error, setError] = useState(null); // Để hiển thị lỗi nếu có

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Bắt đầu tải dữ liệu
        const response = await axios.get(`${url}/content/${groupId}`);
        const data = response.data;
        if (data.length > 0) {
            setGroupName(data[0].group_name); // Lấy tên nhóm từ phần tử đầu tiên
          }
        
        setContents(response.data); // Lưu dữ liệu vào state
        setError(null); // Xóa lỗi nếu trước đó có

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch content. Please try again later.");
      } finally {
        setLoading(false); // Dừng tải dữ liệu
      }
    };

    fetchData();
  }, [groupId]);

  if (loading) return <p>Loading content...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h3>Group {groupName || `Group ID: ${groupId}`}</h3>
      {contents.length === 0 ? (
        <p>No content available for this group.</p>
      ) : (
        contents.map((item) => (
          <div key={item.id} style={{ marginBottom: "20px", borderBottom: "1px solid #ccc" }}>
            {item.post_content && (
                <div>
                    <p>{item.post_content}</p>
                    <h6>
                        {item.users_id} -{" "}
                        {new Date(item.timestamp).toLocaleString()}
                    </h6>
                </div>)}
            {item.movie_poster_path && (
              <div>
                <img
                  src={item.movie_poster_path}
                  alt={item.movie_title}
                  style={{ width: "100px", height: "auto" }}
                />
                <p>{item.movie_title}</p>
                <h6>
                    {item.users_id} -{" "}
                    {new Date(item.timestamp).toLocaleString()}
                </h6>
              </div>
            )}
            {item.show_time_image && (
              <div>
                <img
                  src={item.show_time_image}
                  alt={item.show_time_title}
                  style={{ width: "100px", height: "auto" }}
                />
                <p>{item.show_time_title}</p>
                <p>
                  {new Date(item.show_time_start).toLocaleString()} -{" "}
                  {new Date(item.show_time_end).toLocaleString()}
                </p>
                <h6>
                    {item.users_id} -{" "}
                    {new Date(item.timestamp).toLocaleString()}
                </h6>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ContentList;
