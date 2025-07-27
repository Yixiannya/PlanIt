export async function getModSchedule(year, id) {
    console.log(`https://api.nusmods.com/v2/${year}/modules/${id}.json`)
    try {
        const mod = await fetch(
          `https://api.nusmods.com/v2/${year}/modules/${id}.json`
        );
        if (!mod.ok) {
        throw new Error(`Response Error status: ${mod.status}`);
        }
        const data = await mod.json();
        return data;
      } catch (error) {
         console.error('Fetch error:', error);
     }
  };