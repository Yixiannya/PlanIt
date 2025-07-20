import React from 'react';
import { render } from '@testing-library/react-native';
import SelectModAY from '../component/SelectModAY';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    pop: jest.fn(),
  }),
}));

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2029-01-01'));
});

test('renders SelectModAY years correctly with date', async () => {

  const { findByText} = render(
    <SelectModAY/>
  );

  expect(await findByText("2029 / 2030")).toBeTruthy();
  expect(await findByText("2028 / 2029")).toBeTruthy();
});