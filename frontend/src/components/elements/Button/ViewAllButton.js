import React from 'react';
import { Link } from 'react-router-dom';  // Import Link for navigation
import './ViewAllButton.css';  // Import the CSS file

const ViewAllButton = ({ link }) => {
    return (
        <Link to={link} className="view-all-button">
            <span>
                View All
            </span>
        </Link>
    );
};

export default ViewAllButton;
