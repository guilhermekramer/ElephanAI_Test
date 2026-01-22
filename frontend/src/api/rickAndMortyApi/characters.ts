import rickAndMortyApi from '../rickAndMortyApi/index';
import type { Character, CharactersResponse } from './../../types/types';

export async function getCharacters( page: number = 1, name?: string ): Promise<CharactersResponse> {
  const { data } = await rickAndMortyApi.get<CharactersResponse>( '/character', { params: { page, name: name || undefined }, })
  return data
}
