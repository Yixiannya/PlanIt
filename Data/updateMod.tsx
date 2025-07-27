export async function updateMod(id, information) {
  try {
      console.log(information);
      await fetch(`https://planit-40q0.onrender.com/api/mods/${id}/update`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(information),
        });

     } catch (error) {
         console.error('Fetch error:', error);
     } finally {
        console.log('Mod Updated:', information);
     }
};