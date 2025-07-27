import {sorting} from "../component/Main-page"

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    signOut: jest.fn(() => Promise.resolve()),
  },}));
const today = new Date("2025-06-27T14:30:00")
const loading = false;
const actualEvents = [
{dueDate: '2025-06-28T14:30:00', endDate: '2025-06-29T14:30:00'},
{dueDate: '2025-06-25T14:30:00', endDate: '2025-06-26T14:30:00'},
{dueDate: '2025-06-26T14:30:00', endDate: '2025-06-28T14:30:00'},
]
test('sorter working correctly', () => {
    const result = sorting(today, loading, actualEvents);

      expect(result).toEqual([
        { dueDate: '2025-06-26T14:30:00', endDate: '2025-06-28T14:30:00'},
        { dueDate: '2025-06-28T14:30:00', endDate: '2025-06-29T14:30:00' },
      ]);
});