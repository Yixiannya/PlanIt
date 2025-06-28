export async function deleteGroup(gp, information) {
  try {
     const deletefetch = await fetch(`https://planit-40q0.onrender.com/api/groups/${gp}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(information),
        });

        if (!deletefetch.ok) {
            throw new Error(`Cannot delete: ${deletefetch.status}`);
        }

     } catch (error) {
         console.error('Delete error:', error);
     } finally {
        console.log('Event deleted:', information);
     }
};