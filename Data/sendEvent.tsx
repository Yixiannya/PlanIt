export async function sendEvent(information) {
  try {
      console.log(information);
     const sendfetch = await fetch('https://planit-40q0.onrender.com/api/events', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(information),
        });

        if (!sendfetch.ok) {
        throw new Error(`Response status: ${sendfetch.status}`);
        }

     } catch (error) {
         console.error('Fetch error:', error);
     } finally {
        console.log('Event created:', information);
     }
};

