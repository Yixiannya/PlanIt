export async function editUser(edit, id) {
     const editfetch = await fetch(`https://planit-40q0.onrender.com/api/users/${id}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(edit),
     });
};