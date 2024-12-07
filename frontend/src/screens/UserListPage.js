import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser } from 'react-icons/fa'; // Import user icon
import styles from './UserListPage.module.css';
import Navigation from '../components/Navigation';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get('http://localhost:3001/api/auth/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className={styles.userListPage}>
      <Navigation />
      <h1>All Users</h1>
      <div className={styles.userListContainer}>
        {users.map((user) => (
          <div key={user.id} className={styles.userCard}>
            <FaUser className={styles.userIcon} /> {/* User icon */}
            <h3>{user.email}</h3>
            <button
              className={styles.sharedLinkButton}
              onClick={() => navigate(`/shared-favorites/${user.id}`)}
            >
              View Favorites
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserListPage;