import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { prepare } from '../REUSABLES/SendModButton';

test('prepares mod correctly', async () => {
  const input = [
    { moduleCode: "CS2100", title: "Computer Organisation" },
    { moduleCode: "IS1108", title: "Digital Ethics and Data Privacy" },
  ];
  const result = prepare("2025-08-12", input, "2025-2026", 1, { _id: "123" });

        expect(result).toEqual([
         {
           moduleCode: "CS2100",
           description: "Computer Organisation",
           year: "2025-2026",
           semester: 1,
           startDate: "2025-08-12",
           isComplete: false,
           userId: "123"
         },
         {
           moduleCode: "IS1108",
           description: "Digital Ethics and Data Privacy",
           year: "2025-2026",
           semester: 1,
           startDate: "2025-08-12",
           isComplete: false,
           userId: "123"
         }
       ]);
  });