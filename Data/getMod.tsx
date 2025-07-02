export async function getMod(id) {
    try {
        const mod = await fetch(
          `https://api.nusmods.com/v2/${id}/moduleList.json`
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