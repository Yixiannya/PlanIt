export async function getEvent(information) {
  try {
     const response = await fetch('https://planit-40q0.onrender.com/api/events', {
        method: "POST",
        headers: {
        },
        body: JSON.stringify(information),
        });

        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }

     } catch (error) {
         console.error('Fetch error:', error);
     } finally {
        console.log('Event created:', information);
     }
};

