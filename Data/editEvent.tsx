export async function editEvent(id, edit) {
  try {
     const response = await fetch(`https://planit-40q0.onrender.com/api/events/${id}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(edit),
     });

     if (!response.ok) {
        throw new Error(`Cannot edit: ${response.status}`);
     }

     } catch (error) {
         console.error('Edit error:', error);

     } finally {
        console.log('Event edited:', edit);
     }
};