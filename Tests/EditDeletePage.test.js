import React from 'react';
import { render } from '@testing-library/react-native';
import EditDeletePage from '../component/EditDeletePage';
import { Alert } from 'react-native';
import { useUserStore } from '../Data/userStore';


jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    pop: jest.fn(),
    replace: jest.fn(),
  }),
}));

  useUserStore.setState({
    user: { _id: 'user123', admins: [1, 2, 3], notificationsEnabled: true },
  });

jest.spyOn(Alert, 'alert').mockImplementation(() => {});

beforeEach(() => {
    jest.clearAllMocks();
  });

  const location = jest.fn();

  const Event = {
      _id: '1',
      name: 'Test Event',
      description: 'Description here',
      dueDate: '2025-06-28T14:30:00',
      endDate: '2026-07-29T17:30:00',
    };

  const Event2 = {
        _id: '1',
        name: 'Test Event',
        description: 'Description here',
        dueDate: '2025-06-28T14:30:00',
        endDate: '2026-07-29T17:30:00',
        groupName: {name: "help", admins: [1,2,3]},
        group: "scam",
        venue: "Place",
        offsetMs: 0,
  };

  const Event3 = {
          _id: '1',
          name: 'Test Event',
          description: 'Description here',
          dueDate: '2025-06-28T14:30:00',
          endDate: '2026-07-29T17:30:00',
          offsetMs: 300000
    };

    const Event4 = {
              _id: '1',
              name: 'Test Event',
              description: 'Description here',
              dueDate: '2025-06-28T14:30:00',
              endDate: '2026-07-29T17:30:00',
              offsetMs: 10800000
        };

test('renders EditDeletePage correctly without group', async () => {

  const { findByText, queryByText } = render(
    <EditDeletePage
      route={{ params: { event: Event, location: location, allEvents: Event } }}
    />
  );

  expect(await findByText('Test Event')).toBeTruthy();
  expect(await findByText('Description here')).toBeTruthy();

  expect(await findByText('28/06/2025, 14:30:00')).toBeTruthy();
  expect(await findByText('29/07/2026, 17:30:00')).toBeTruthy();

  expect(queryByText('Group:')).toBeNull();
});

test('renders EditDeletePage correctly with group, venue and event starts', async () => {

  const { findByText, queryByText } = render(
    <EditDeletePage
      route={{ params: { event: Event2, location: location, allEvents: Event2 } }}
    />
  );

  expect(await findByText('Test Event')).toBeTruthy();
  expect(await findByText('Description here')).toBeTruthy();

  expect(await findByText('28/06/2025, 14:30:00')).toBeTruthy();
  expect(await findByText('29/07/2026, 17:30:00')).toBeTruthy();
  expect(await findByText("Place")).toBeTruthy();
  expect(await findByText("When event starts")).toBeTruthy();

  expect(await findByText("help")).toBeTruthy();
});

test('renders EditDeletePage correctly with 5 minutes', async () => {

  const { findByText, queryByText } = render(
    <EditDeletePage
      route={{ params: { event: Event3, location: location, allEvents: Event } }}
    />
  );

  expect(await findByText('Test Event')).toBeTruthy();
  expect(await findByText('Description here')).toBeTruthy();

  expect(await findByText('28/06/2025, 14:30:00')).toBeTruthy();
  expect(await findByText('29/07/2026, 17:30:00')).toBeTruthy();
  expect(await findByText('5 minutes before event starts')).toBeTruthy();

  expect(queryByText('Group:')).toBeNull();
});

test('renders EditDeletePage correctly with 3 hours', async () => {

  const { findByText, queryByText } = render(
    <EditDeletePage
      route={{ params: { event: Event4, location: location, allEvents: Event } }}
    />
  );

  expect(await findByText('Test Event')).toBeTruthy();
  expect(await findByText('Description here')).toBeTruthy();

  expect(await findByText('28/06/2025, 14:30:00')).toBeTruthy();
  expect(await findByText('29/07/2026, 17:30:00')).toBeTruthy();
  expect(await findByText('3 hours before event starts')).toBeTruthy();

  expect(queryByText('Group:')).toBeNull();
});