import React, { useEffect, useState } from 'react';
import { Button, Select, Box, Heading, Center } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useStore from '../store';

const Home = () => {
  const navigate = useNavigate();
  const { setUser, user } = useStore();
  const [ users, setUsers ] = useState([]);

  // Fetch users upon component mount
  useEffect(() => {
    axios.get('http://localhost:4000/users')
      .then(res => {
        setUsers(res.data)
      })
      .catch(err => {
        console.error('Error fetching users:', err);
      })
  }, []);

  // Handle user selection from the dropdown
  const handleUserSelect = (event) => {
    const selectedUser = users.find(user => user.id === parseInt(event.target.value));
    setUser(selectedUser);
  }

  return (
    <Box textAlign='center' mt={300}>
      <Heading>Coaching Call Scheduler</Heading>
      <Center mt={4}>
        <Select placeholder='Select User' onChange={handleUserSelect} w='250px' textAlign='center'>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </Select>
      </Center>
      <Button mt={4} onClick={() => navigate(user && user.role === 'coach' ? '/coach-dashboard' : '/student-dashboard')}>
        Go to Dashboard
      </Button>
    </Box>
  )
}

export default Home;