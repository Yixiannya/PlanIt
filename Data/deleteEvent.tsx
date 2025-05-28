export async function deleteEvent(information) {
  try {
     const response = await fetch(`https://planit-40q0.onrender.com/api/events/${information}`, {
        method: "DELETE",
     });

     if (!response.ok) {
        throw new Error(`Cannot delete: ${response.status}`);
     }

     } catch (error) {
         console.error('Delete error:', error);
     } finally {
        console.log('Event deleted:', information);
     }
};