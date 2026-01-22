import rickAndMortyApi from '../rickAndMortyApi/index';
import type { Character, CharactersResponse } from './../../types/types';

export async function getCharacters( page: number = 1 ): Promise<CharactersResponse> {
  const { data } = await rickAndMortyApi.get<CharactersResponse>( '/character', { params: { page }, })
  return data
}

export async function getCharacterById( id: number ): Promise<Character> {
  const { data } = await rickAndMortyApi.get<Character>( `/character/${id}`)
  return data
}
