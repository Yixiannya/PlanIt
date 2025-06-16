export async function sendUser(usertype, gp, information, SD) {
  console.log(`https://planit-40q0.onrender.com/api/groups/${gp}/${usertype}/${SD}`);
  try {
     const sendfetch = await fetch(`https://planit-40q0.onrender.com/api/groups/${gp}/${usertype}/${SD}`, {
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