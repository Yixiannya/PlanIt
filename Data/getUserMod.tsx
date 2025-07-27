export async function getUserMod(userId) {
    try {
        const eventfetch = await fetch(
          `https://planit-40q0.onrender.com/api/users/${userId}/mods`
        );
        if (!eventfetch.ok) {
        throw new Error(`Response Error status: ${eventfetch.status}`);
        }
        const data = await eventfetch.json();
        return data.mods;
      } catch (error) {
         console.error('Fetch error:', error);
     }
  };