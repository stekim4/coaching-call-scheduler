import React, { useEffect, useState } from 'react';
import { Box, Heading, List, ListItem, Input, Button } from '@chakra-ui/react';
import axios from 'axios';
import useStore from '../store';
import { isPast } from 'date-fns';

const CompletedCalls = () => {
  const [calls, setCalls] = useState([]);
  const [selectedCall, setSelectedCall] = useState(null);
  const [satisfaction, setSatisfaction] = useState('');
  const [notes, setNotes] = useState('');
  const { user } = useStore();
  
  useEffect(() => {
    // Fetch completed calls for current coach
    if (user) {
      axios.get('http://localhost:4000/calls')
        .then(res => {
          // Filter and sort calls to get only past calls relevant to current coach
          const pastCalls = res.data
            .filter(call => call.Slot.coachId === user.id && isPast(new Date(call.Slot.endTime)))
            .map(call => ({
              ...call,
              startTime: new Date(call.Slot.startTime).toLocaleString(),
              endTime: new Date(call.Slot.endTime).toLocaleString(),
              studentName: call.student.name,
              studentPhone: call.student.phoneNumber
            }))
            .sort((a, b) => new Date(a.Slot.endTime) - new Date(b.Slot.endTime));

          setCalls(pastCalls);
        })
        .catch(err => {
          console.error('Error fetching calls:', err);
        });
    }
  }, [user]);

  // Handle selection of a call to update
  const handleSelectCall = (call) => {
    setSelectedCall(call);
    setSatisfaction(call.satisfaction || '');
    setNotes(call.coachNotes || '');
  };

  // Handle the update of call details
  const handleUpdateCall = () => {
    if (selectedCall) {
      axios.put(`http://localhost:4000/calls/${selectedCall.id}`, { satisfaction, coachNotes: notes })
        .then(call => {
          const updatedCall = {
            ...call.data,
            startTime: new Date(call.data.Slot.startTime).toLocaleString(),
            endTime: new Date(call.data.Slot.endTime).toLocaleString(),
            studentName: call.data.student.name,
            studentPhone: call.data.student.phoneNumber
          };

          // Create a new array with the updated call
          const updatedCalls = calls.map(call => {
            if (call.id === updatedCall.id) {
              return updatedCall;
            }
            return call;
          });

          setCalls(updatedCalls);
          setSelectedCall(null);
          setSatisfaction('');
          setNotes('');
        })
        .catch(err => {
          console.error('Error updating call:', err);
        });
    }
  };

  return (
    <Box>
      <Heading size='md' mb={2}>Completed Calls</Heading>
      <List>
        {calls.map(call => (
          <ListItem key={call.id}>
            {`${call.startTime} - ${call.endTime} | Student: ${call.studentName} | Satisfaction: ${call.satisfaction} | Notes: ${call.coachNotes}`}
            <Button ml={2} onClick={() => handleSelectCall(call)}>Update</Button>
          </ListItem>
        ))}
      </List>
      
      {selectedCall && (
        <Box mt={2}>
          <Heading size='sm' mb={2}>Update with Notes</Heading>
          <Input
            placeholder='Satisfaction (1-5)'
            value={satisfaction}
            onChange={(e) => setSatisfaction(e.target.value)}
            mb={2}
          />
          <Input
            placeholder='Notes'
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            mb={2}
          />
          <Button onClick={handleUpdateCall}>Save</Button>
        </Box>
      )}
    </Box>
  );
};

export default CompletedCalls;