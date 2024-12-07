import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Row({ item, deleteGroup }) {
  const navigate = useNavigate();
  
  const goToDetails = () => {
    navigate(`/group/${item.id}`);
  };

  return (
    <div className="group-card" onClick={goToDetails}>
      <h4>{item.name}</h4>
      <p>{item.description}</p>
      <FontAwesomeIcon
        icon={faTrash}
        style={{
          color: "gray",
          cursor: "pointer",
          marginLeft: "15px",
        }}
        onClick={(e) => {
          e.stopPropagation(); // Ngăn việc click vào thẻ cha
          deleteGroup(item.id);
        }}
      />
    </div>
  );
}
