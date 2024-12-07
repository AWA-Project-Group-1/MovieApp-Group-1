import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Group from "./screens/Group";
import GroupDetails from "./screens/GroupDetails";

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Route chính để hiển thị danh sách nhóm */}
        <Route path="/" element={<Group />} />
        
        {/* Route chi tiết nhóm */}
        <Route path="/group/:id" element={<GroupDetails />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
