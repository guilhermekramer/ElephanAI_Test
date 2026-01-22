import rickAndMortyApi from '../rickAndMortyApi/index';

export const getCharacters = async (page: number = 1) => {
  try{
    const response = await rickAndMortyApi.get('/character', { params: { page }});
    if (response.status === 200) {
      return response.data;
    }
  }catch(error){
    console.error('[API] Error fetching characters:', error);
    return null;
  }
  
}

export const getCharacterById = async (id: number) => {
  try{
    const response = await rickAndMortyApi.get(`/character/${id}`);
    if (response.status === 200) {
      return response.data;
    }
  }catch(error){
    console.error(`[API] Error fetching character with id ${id}:`, error);
    return null;
  }
}

