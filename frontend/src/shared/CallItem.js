import React from 'react';
import { ListItem } from '@chakra-ui/react';

const CallItem = ({ call, user }) => {
  const startTime = new Date(call.Slot.startTime).toLocaleString();
  const endTime = new Date(call.Slot.endTime).toLocaleString();

  const contactInfo = user.role === 'student' ? 
    `Coach: ${call.Slot.coach.name} | Coach Phone: ${call.Slot.coach.phoneNumber}` :
    `Student: ${call.student.name} | Student Phone: ${call.student.phoneNumber}`;

  return (
    <ListItem key={call.id}>
      {`${startTime} - ${endTime} | ${contactInfo}`}
    </ListItem>
  );
};

export default CallItem;