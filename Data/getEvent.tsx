export async function getEvent() {
  try {
        const response = await fetch(
          'https://planit-40q0.onrender.com/api/events'
        );
        if (!response.ok) {
        throw new Error(`Response Error status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      } catch (error) {
         console.error('Fetch error:', error);
     }
  };