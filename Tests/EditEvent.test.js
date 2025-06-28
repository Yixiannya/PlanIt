import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EditEventButton from '../REUSABLES/EditEventButton';
import { editEvent } from '../Data/editEvent';

jest.mock('../Data/editEvent', () => ({
  editEvent: jest.fn(),
}));

const location = jest.fn();

test('calls editEvent with correct structure', async () => {

  const { getByText } = render(
    <EditEventButton
      ID="event123"
      Name="Test Event"
      Date="2024-06-27"
      Hour="12"
      Minute="30"
      endDate="2024-06-27"
      endHour="14"
      endMinute="00"
      allEvents={[]}
      Description="Test description"
      Location={location}
    />
  );

  fireEvent.press(getByText('Edit event'));

  expect(editEvent).toHaveBeenCalledWith('event123', {
    name: 'Test Event',
    dueDate: '2024-06-27T12:30:00.000Z',
    description: 'Test description',
    endDate: '2024-06-27T14:00:00.000Z',
  });
});