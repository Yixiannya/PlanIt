export async function syncCalendar(information) {
  try {
      console.log(information);
      await fetch(`https://planit-40q0.onrender.com/api/google/calendar/import`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(information),
        });

     } catch (error) {
         console.error('Fetch error:', error);
     } finally {
        console.log('Calendar synced:', information);
     }
};