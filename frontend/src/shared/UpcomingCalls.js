import React, { useEffect, useState } from 'react';
import { Box, Heading, List, ListItem } from '@chakra-ui/react';
import axios from 'axios';
import useStore from '../store';
import { isFuture } from 'date-fns';
import CallItem from './CallItem';

const UpcomingCalls = () => {
  const [calls, setCalls] = useState([]);
  const { user, callsUpdated, setCallsUpdated } = useStore();

  useEffect(() => {
    // Fetch calls for current user
    if (user) {
      axios.get('http://localhost:4000/calls')
        .then(res => {
          // Filter and sort calls to get only future calls relevant to current user
          const upcomingCalls = res.data
            .filter(call => {
              const isFutureCall = isFuture(new Date(call.Slot.startTime));
              if (user.role === 'student') {
                return isFutureCall && call.studentId === user.id;
              } else if (user.role === 'coach') {
                return isFutureCall && call.Slot.coachId === user.id;
              }
            })
            .sort((a, b) => new Date(a.Slot.startTime) - new Date(b.Slot.startTime));

          setCalls(upcomingCalls);
          setCallsUpdated(false); // Reset calls updated flag
        })
        .catch(err => {
          console.error('Error fetching calls:', err);
        });
    }
  }, [user, callsUpdated]);

  return (
    <Box>
      <Heading size='md' mb={2}>Upcoming Calls</Heading>
      <List>
        {calls.map(call => (
          <CallItem key={call.id} call={call} user={user} />
        ))}
      </List>
    </Box>
  );
};

export default UpcomingCalls;
