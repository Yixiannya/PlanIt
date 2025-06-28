export async function getGroup(userId) {
    try {
        console.log(`https://planit-40q0.onrender.com/api/groups/${userId}/`);
        const eventfetch = await fetch(
          `https://planit-40q0.onrender.com/api/groups/${userId}/`
        );
        if (!eventfetch.ok) {
        throw new Error(`Response Error status: ${eventfetch.status}/`);
        }
        const data = await eventfetch.json();
        console.log(data);
        return data;
      } catch (error) {
         console.error('Fetch error:', error);
     }
  };