import React from 'react';
import { Box, Heading, Button, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import AvailableSlots from '../student/AvailableSlots';
import UpcomingCalls from '../shared/UpcomingCalls';
import useStore from '../store';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useStore();

  return (
    <Box maxWidth='1000px' mx='auto' width='100%' mt={50}>
      <Heading mb={4}>{`Hi, ${user.name}!`}</Heading>
      <Stack spacing={4}>
        <AvailableSlots />
        <UpcomingCalls />
        <Button width='150px' onClick={() => navigate('/')}>Back to Home</Button>
      </Stack>
    </Box>
  );
};

export default StudentDashboard;