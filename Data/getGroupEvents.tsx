export async function getGroupEvents(groupId, purpose) {

  const url = `https://planit-40q0.onrender.com/api/groups/${groupId}${purpose}`;
    console.log("Hi", url);
  try {
    const response = await fetch(url);
  if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}`);
    }
    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Fetch error:', error);
  }
}