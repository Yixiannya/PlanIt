export async function editGroup(edit, id) {
    console.log(`https://planit-40q0.onrender.com/api/group/${id}`)
  try {
     const editfetch = await fetch(`https://planit-40q0.onrender.com/api/groups/${id}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(edit),
     });

     if (!editfetch.ok) {
        throw new Error(`Cannot edit: ${editfetch.status}`);
     }

     } catch (error) {
         console.error('Edit error:', error);

     } finally {
        console.log('User edited:', edit);
     }
};