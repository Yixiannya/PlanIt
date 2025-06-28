import React from 'react';
import { render } from '@testing-library/react-native';
import Groups from '../component/Groups';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    pop: jest.fn(),
  }),
}));

test('renders only the group items grid', () => {
  const groupsData = [
    { _id: '1', name: 'Alpha' },
    { _id: '2', name: 'Beta' },
    { _id: '3', name: 'Gamma' },
  ];

  const { getByText } = render(
    <Groups route={{ params: { loading: false, Groups: groupsData } }} />
  );

  groupsData.forEach((group) => {
    expect(getByText(group.name)).toBeTruthy();
  });

});