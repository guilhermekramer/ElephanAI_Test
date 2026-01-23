import rickAndMortyApi from '../rickAndMortyApi/index';
import type { CharactersResponse, Character } from './../../types/types';

export async function getCharacters( page: number = 1, name?: string ): Promise<CharactersResponse> {
  const { data } = await rickAndMortyApi.get<CharactersResponse>( '/character', { params: { page, name: name || undefined }, })
  return data
}

export async function getCharactersByIds(ids: number[]): Promise<Character[]> {
  if (ids.length === 0) return []
  const { data } = await rickAndMortyApi.get<Character | Character[]>(
    `/character/${ids.join(',')}`
  )
  return Array.isArray(data) ? data : [data]
}
