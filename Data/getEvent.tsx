export async function getEvent(userId) {
    try {
        const eventfetch = await fetch(
          `https://planit-40q0.onrender.com/api/users/${userId}/events`
        );
        if (!eventfetch.ok) {
        throw new Error(`Response Error status: ${eventfetch.status}`);
        }
        const data = await eventfetch.json();
        return data.events;
      } catch (error) {
         console.error('Fetch error:', error);
     }
  };