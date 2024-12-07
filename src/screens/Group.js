import './Group.css';
import { useEffect, useState, React } from 'react';
import axios from 'axios';
import Row from '../components/Row.js';
import useUser from '../context/useUser.js';

const url = 'http://localhost:3001';

function Group() {
  const { user } = useUser();
  const [groups, setGroups] = useState('');
  const [description, setDescription] = useState('');
  const [groupss, setGroupss] = useState([]);
  
  useEffect(() => {
    axios.get(url)
      .then((response) => {
        setGroupss(response.data)
      }).catch(error => {
        alert(error.response?.data?.error || "An error occurred when fetching!")
      })
  }, [])

  const addGroup = () => {
    if (!user?.token) {
      alert('User is not authenticated!');
      return;
    }

    const headers = {headers: {Authorization:`Bearer ${user.token}`}};
    axios.post(url + '/create', {name: groups, description, owners_id: user.id}, headers)
    .then(response => {
      setGroupss([...groupss, {id: response.data.id, name: groups, description }]);
      setGroups('');
      setDescription('');
    }).catch(error => {
      alert(error.response?.data?.error || "An error occurred when fetching!!");
      console.error(error);
    });  
  }

  
  const deleteGroup = (id) => {
    const token = user.token || sessionStorage.getItem('token');

    //console.log("Token before delete request:", token); // Log token trước khi gửi request
    console.log("GroupId before delete request:", id);
    console.log("UserId before delete request:", user.id);

    if (!token) {
        alert("User is not authenticated.");
        return;
    }

    const headers = { headers: { Authorization: `Bearer ${token}` } };
    console.log("Token used for deletion:", token);
    axios
        .delete(`${url}/delete/${id}`, headers)
        .then(() => {
            const withoutRemoved = groupss.filter(item => item.id !== id);
            setGroupss(withoutRemoved);
            alert(`Group with ID ${id} deleted successfully.`);
        })
        .catch(error => {
          console.error("Error during delete request:", error);
          alert(error.response?.data?.error || "An error occurred.");
        });
};
  
  return (
    <div id="container">
      <h3>Group page</h3>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          placeholder="Group name"
          value={groups}
          onChange={(e) => setGroups(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="5"
        />
      </form>
      <button className="add-group-button" onClick={addGroup}>Add Group</button>

      <div className="group-container">
        {groupss.map(item => (
          <Row key={item.id} item={item} deleteGroup={deleteGroup}/>
        ))}
      </div>
    </div>
  );
}

export default Group;
