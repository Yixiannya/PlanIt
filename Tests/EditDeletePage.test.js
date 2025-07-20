import React from 'react';
import { render } from '@testing-library/react-native';
import EditDeletePage from '../component/EditDeletePage';
import { Alert } from 'react-native';
import {getGroupEvents} from '../Data/getGroupEvents'
import {userStore} from '../Data/userStore'


jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    pop: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock('../Data/getGroupEvents', () => ({
  getGroupEvents: jest.fn().mockResolvedValue({
      name: 'Test Group',
      admins: ['user1'],
    }),
}));

jest.mock('../Data/userStore', () => ({
   useUserStore: jest.fn((fn) => fn({ user: { _id: 'user123', admins: [1,2,3] } })),
 }));

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
        group: 'bruh'
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

test('renders EditDeletePage correctly with group', async () => {

  const { findByText, queryByText } = render(
    <EditDeletePage
      route={{ params: { event: Event2, location: location, allEvents: Event2 } }}
    />
  );

  expect(await findByText('Test Event')).toBeTruthy();
  expect(await findByText('Description here')).toBeTruthy();

  expect(await findByText('28/06/2025, 14:30:00')).toBeTruthy();
  expect(await findByText('29/07/2026, 17:30:00')).toBeTruthy();

  expect(await findByText('Test Group')).toBeTruthy();
});