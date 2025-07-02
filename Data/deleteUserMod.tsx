export async function deleteUserMod(information, id) {
  try {
     const deletefetch = await fetch(`https://planit-40q0.onrender.com/api/mods/${information}`, {
        method: "DELETE",
     });

     } catch (error) {
         console.error('Delete error:', error);
     } finally {
        console.log('Event deleted:', information);
     }
};