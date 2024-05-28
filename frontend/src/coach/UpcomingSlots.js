import React, { useEffect, useState } from 'react';
import { Box, Heading, List, ListItem } from '@chakra-ui/react';
import axios from 'axios';
import useStore from '../store';
import { isFuture } from 'date-fns'; // Add this import

const UpcomingSlots = () => {
  const [slots, setSlots] = useState([]);
  const { user, slotsUpdated, setSlotsUpdated } = useStore();

  useEffect(() => {
    // Fetch upcoming slots for current coach
    if (user) {
      axios.get(`http://localhost:4000/slots/coach/${user.id}`)
        .then(res => {
          // Filter and sort slots to get only future slots relevant to current coach
          const futureSlots = res.data
            .filter(slot => isFuture(new Date(slot.startTime)))
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
            
          setSlots(futureSlots);
          setSlotsUpdated(false);
        })
        .catch(err => {
          console.error('Error fetching slots:', err);
        });
    }
  }, [user, slotsUpdated]);

  return (
    <Box>
      <Heading size='md' mb={2}>Upcoming Slots</Heading>
      <List>
        {slots.map(slot => (
          <ListItem key={slot.id}>
            {`${new Date(slot.startTime).toLocaleString()} - ${new Date(slot.endTime).toLocaleString()}`}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default UpcomingSlots;
