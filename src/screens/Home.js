import './Home.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Row from '../components/Row.js';
import useUser from '../context/useUser.js';
//import Authentication, { AuthenticationMode } from './Authentication.js';

const url = 'http://localhost:3001';

function Home() {
  const { user } = useUser();
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    axios.get(url)
      .then((response) => {
        setTasks(response.data)
      }).catch(error => {
        alert(error.response?.data?.error || "An error occurred when fetching!")
      })
  }, [])

  const addTask = () => {
    if (!user?.token) {
      alert('User is not authenticated!');
      return;
    }

    const headers = {headers: {Authorization:`Bearer ${user.token}`}};
    axios.post(url + '/create', {description: task}, headers)
    .then(response => {
      setTasks([...tasks, {id: response.data.id, description: task}])
      setTask('')
    }).catch(error => {
      alert(error.response?.data?.error || "An error occurred when fetching!!")
    })  
  }
  
  const deleteTask = (id) => {
    if (!user?.token) {
      alert("User is not authenticated.");
      return;
    }

    const headers = { headers: { Authorization: `Bearer ${user.token}` } };
    axios.delete(url + '/delete/' + id, headers)
        .then(() => {
            const withoutRemoved = tasks.filter(item => item.id !== id);
            setTasks(withoutRemoved);
        })
        .catch(error => {
            alert(error.response?.data?.error || "An error occurred when fetching!!!");
        });
};
  
  return (
    <div id="container">
      <h3>Todos</h3>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          placeholder='Add new task'
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addTask()
            }
          }}
        />
      </form>
      <div>
        {tasks.map(item => (
          <Row key={item.id} item={item} deleteTask={deleteTask}/>
        ))}
      </div>
    </div>
  );
}

export default Home;