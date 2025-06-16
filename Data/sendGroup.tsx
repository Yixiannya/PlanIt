export async function sendGroup(information) {
  try {
     const sendfetch = await fetch("https://planit-40q0.onrender.com/api/groups", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(information),
        });

        if (!sendfetch.ok) {
        throw new Error(`Response status: ${sendfetch.status}`);
        }

        const data = await sendfetch.json();

        console.log('Response data:', data);
        return data;
     } catch (error) {
         console.error('Fetch error:', error);
     } finally {
        console.log('Event created:', information);
     }
};