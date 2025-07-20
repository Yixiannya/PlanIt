import {sorter, prepare} from "../component/ModClasses"

const actualEvents = [
  { day: 'Wednesday', startTime: '14:30' },
  { day: 'Saturday',  startTime: '14:30' },
  { day: 'Friday',    startTime: '14:30' },
];

const classExample =  [ { lessonType: 'Lecture', classNo: '05', day: 'Monday',
                  startTime: '10:00', endTime: '12:00', weeks: [1, 2, 3], venue: 'LT1' }]

test('sorter working correctly', () => {
    const result = sorter(actualEvents);

      expect(result).toEqual([
        { day: 'Wednesday', startTime: '14:30' },
        { day: 'Friday',    startTime: '14:30' },
        { day: 'Saturday',  startTime: '14:30' },
      ]);
});

test('prepare returns proper json', () => {
    result3 = prepare(classExample, "MYID");
    expect(result3).toEqual(
      [{
        userId: "MYID",
        lessonType: 'Lecture',
        classNo: '05',
        startTime: '10:00',
        endTime: '12:00',
        day: "Monday",
        }]
    );
  });