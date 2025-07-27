import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CreateEventButton from '../REUSABLES/CreateEventButton';
import { sendEvent } from '../Data/sendEvent';
import { useUserStore } from '../Data/userStore';

jest.mock('../Data/sendEvent', () => ({
  sendEvent: jest.fn(),
}));

jest.mock('../Data/userStore', () => ({
  useUserStore: jest.fn((fn) => fn({ user: { _id: 'user123' } })),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

const mockLocation = jest.fn();

test('calls sendEvent with proper structure when Group prop is provided', async () => {

  const { getByText } = render(
    <CreateEventButton
      Name="Meeting"
      Date="2024-06-27"
      Hour="10"
      Minute="00"
      endDate="2024-06-27"
      endHour="11"
      endMinute="00"
      Description="Project discussion"
      allEvents={[]}
      Group={{ _id: 'group456' }}
      Location={mockLocation}
      venue = "Something"
      offsetMs = {3000}
    />
  );

  fireEvent.press(getByText('Add new event'));

    expect(sendEvent).toHaveBeenCalledWith({
      name: 'Meeting',
      owner: 'user123',
      dueDate: '2024-06-27T10:00:00.000Z',
      endDate: '2024-06-27T11:00:00.000Z',
      description: 'Project discussion',
      group: 'group456',
      venue: "Something",
      offsetMs: 3000,
  });
});

const location = jest.fn();

test('calls sendEvent with proper structure when Group is not provided', async () => {

  const { getByText } = render(
    <CreateEventButton
      Name="Solo Event"
      Date="2024-06-27"
      Hour="15"
      Minute="30"
      endDate="2024-06-27"
      endHour="16"
      endMinute="30"
      Description="Working alone"
      allEvents={[]}
      Group={null}
      Location={location}
      venue = ""
      offsetMs = {0}
    />
  );

  fireEvent.press(getByText('Add new event'));

    expect(sendEvent).toHaveBeenCalledWith({
      name: 'Solo Event',
      owner: 'user123',
      dueDate: '2024-06-27T15:30:00.000Z',
      endDate: '2024-06-27T16:30:00.000Z',
      description: 'Working alone',
      venue: "",
      offsetMs: 0,
  });
});