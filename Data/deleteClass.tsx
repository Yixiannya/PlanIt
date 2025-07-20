export async function deleteClass(id, information) {
    console.log(`https://planit-40q0.onrender.com/api/mods/${id}/class/leave`);
  try {
      console.log(information);
      return await fetch(`https://planit-40q0.onrender.com/api/mods/${id}/class/leave`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(information),
        });
     } catch (error) {
         console.error('Fetch error:', error);
     } finally {
        console.log('Mod deleted:', information);
     }
};