import React, { useEffect, useState } from 'react';
import { Box, Heading, List, ListItem, Select, Button } from '@chakra-ui/react';
import axios from 'axios';
import useStore from '../store';
import { isFuture } from 'date-fns';

const AvailableSlots = () => {
  const [coaches, setCoaches] = useState([]);
  const [selectedCoachId, setSelectedCoachId] = useState('');
  const [slots, setSlots] = useState([]);
  const { user, setCallsUpdated } = useStore();

  // Fetch list of coaches on component mount
  useEffect(() => {
    axios.get('http://localhost:4000/users')
      .then(res => {
        const coachUsers = res.data.filter(user => user.role === 'coach');

        setCoaches(coachUsers);
      })
      .catch(err => {
        console.error('Error fetching coaches:', err);
      });
  }, []);

  // Fetch available slots whenever a coach is selected
  useEffect(() => {
    if (selectedCoachId) {
      axios.get(`http://localhost:4000/slots/coach/${selectedCoachId}`)
        .then(res => {
          const availableSlots = res.data
            .filter(slot => !slot.callId && isFuture(new Date(slot.startTime)))
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

          setSlots(availableSlots);
        })
        .catch(err => {
          console.error('Error fetching slots:', err);
        });
    }
  }, [selectedCoachId]);

  // Handle booking of a slot
  const handleBooking = (slotId) => {
    if (user) {
      axios.post('http://localhost:4000/calls', { studentId: user.id, slotId })
        .then(res => {
          // Filter out the booked slot so that it no longer displays as available
          setSlots(slots.filter(currentSlot => currentSlot.id !== slotId));
          setCallsUpdated(true); // Update the callsUpdated flag to true
        })
        .catch(err => {
          console.error('Error creating call:', err);
        });
    }
  };

  return (
    <Box>
      <Heading size='md' mb={2}>Available Slots</Heading>
      <Select placeholder='Select Coach' onChange={(e) => setSelectedCoachId(e.target.value)}>
        {coaches.map(coach => (
          <option key={coach.id} value={coach.id}>
            {coach.name}
          </option>
        ))}
      </Select>

      <List mt={2}>
        {slots.map(slot => (
          <ListItem key={slot.id}>
            {`${new Date(slot.startTime).toLocaleString()} - ${new Date(slot.endTime).toLocaleString()}`}
            <Button ml={2} onClick={() => handleBooking(slot.id)}>Book</Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AvailableSlots;
