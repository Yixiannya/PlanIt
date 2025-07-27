import { prepare, prepare2, sorter } from "../component/ConfigureMods"

const actualEvents = [
  { day: 'Wednesday', startTime: '14:30' },
  { day: 'Saturday',  startTime: '14:30' },
  { day: 'Friday', startTime: '14:30' },
];

const classExample =  [ { lessonType: 'Lecture', classNo: '05', day: 'Monday',
                  startTime: '10:00', endTime: '12:00', weeks: [1, 2, 3], venue: 'LT1' }]

const mod = {
      moduleCode: 'CS1010',
      description: 'Programming Methodology',
      year: "2025-2026",
      semester: 1,
      startDate: "2003-06-15T14:30:00Z"
      }


test('sorter working correctly', () => {
    const result = sorter(actualEvents);

      expect(result).toEqual([
        { day: 'Wednesday', startTime: '14:30' },
        { day: 'Friday',    startTime: '14:30' },
        { day: 'Saturday',  startTime: '14:30' },
      ]);
});

test('prepare returns proper json', () => {
    const result2 = prepare(classExample, mod, "MYID");
    expect(result2).toEqual(
      [{
        moduleCode: 'CS1010',
        lessonType: 'Lecture',
        classNo: '05',
        description: 'Programming Methodology',
        year: "2025-2026",
        semester: 1,
        day: "Monday",
        startDate: "2003-06-15T14:30:00Z",
        startTime: '10:00',
        endTime: '12:00',
        weeks: [1, 2, 3],
        userId: "MYID",
        venue: 'LT1'
      }]
    )
  });

test('prepare2 returns proper json', () => {
    result3 = prepare2(classExample, "MYID");
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