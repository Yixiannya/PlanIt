export async function deleteEvent(information) {
  try {
     const deletefetch = await fetch(`https://planit-40q0.onrender.com/api/events/${information}`, {
        method: "DELETE",
     });

     if (!response.ok) {
        throw new Error(`Cannot delete: ${deletefetch.status}`);
     }

     } catch (error) {
         console.error('Delete error:', error);
     } finally {
        console.log('Event deleted:', information);
     }
};