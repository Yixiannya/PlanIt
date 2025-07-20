export async function deleteUserMod(information, id) {
  try {
     const deletefetch = await fetch(`https://planit-40q0.onrender.com/api/mods/${information}/leave`, {
         method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(id),
                });

     } catch (error) {
         console.error('Delete error:', error);
     } finally {
        console.log('Event deleted:', information);
     }
};