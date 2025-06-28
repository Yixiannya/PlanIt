import {sorter} from "../component/Calendar-page"

const loading = false;
const selected = '2025-06-28';
const actualEvents = [
{dueDate: '2025-06-25T14:30:00', endDate: '2025-06-26T14:30:00'},
{dueDate: '2025-06-28T14:30:00', endDate: '2025-06-29T14:30:00'},
{dueDate: '2025-06-27T14:30:00', endDate: '2025-06-28T14:30:00'},
]
test('sorter working correctly', () => {
    const result = sorter(loading, selected, actualEvents);

      expect(result).toEqual([
        { dueDate: '2025-06-27T14:30:00', endDate: '2025-06-28T14:30:00'},
        { dueDate: '2025-06-28T14:30:00', endDate: '2025-06-29T14:30:00' },
      ]);
});