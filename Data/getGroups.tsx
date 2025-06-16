export async function getGroups(userId) {
    try {
        const eventfetch = await fetch(
          `https://planit-40q0.onrender.com/api/users/${userId}/groups`
        );
        if (!eventfetch.ok) {
        throw new Error(`Response Error status: ${eventfetch.status}`);
        }
        const data = await eventfetch.json();
        console.log(data.groups)
        return data.groups;
      } catch (error) {
         console.error('Fetch error:', error);
     }
  };