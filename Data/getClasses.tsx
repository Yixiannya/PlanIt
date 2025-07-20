export async function getClasses(id, information) {
  try {
      console.log(information);
      const returnInfo = await fetch(`https://planit-40q0.onrender.com/api/mods/${id}/classes`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(information),
        });
        const data = await returnInfo.json();
        return data;
     } catch (error) {
         console.error('Fetch error:', error);
     } finally {
        console.log('Event created:', information);
     }
};