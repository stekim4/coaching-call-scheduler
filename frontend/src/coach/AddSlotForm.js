import React, { useState } from 'react';
import { Box, Heading, Button, Input } from '@chakra-ui/react';
import axios from 'axios';
import useStore from '../store';
import { addHours, parseISO } from 'date-fns';

const AddSlotForm = () => {
  const [startTime, setStartTime] = useState('');
  const { user, setSlotsUpdated } = useStore();
  
  // Handle creation of a new slot
  const handleAddSlot = () => {
    if (user) {
      // Calculate end time by adding 2 hours to the start time
      const endTime = addHours(parseISO(startTime), 2).toISOString(); // parseISO to convert string to date object

      axios.post('http://localhost:4000/slots', { coachId: user.id, startTime, endTime })
        .then(response => {
          setSlotsUpdated(true);
        })
        .catch(err => {
          console.error('Error adding slot:', err);
        });
    }
  };

  return (
    <Box>
      <Heading size='md' mb={2}>Add Slot</Heading>
      <Input
        type='datetime-local'
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        w='250px'
      />
      <Button ml={2} onClick={handleAddSlot}>Add Slot</Button>
    </Box>
  );
};

export default AddSlotForm;
