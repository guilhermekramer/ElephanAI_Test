import nodeApi from "./index"


interface FavoritesResponse {
  favorites: number[]
}

export async function getFavorites(): Promise<number[]> {
  const response = await nodeApi.get<FavoritesResponse>("/favorites")
  return response.data.favorites
}

export async function addFavorite(characterId: number): Promise<void> {
  await nodeApi.post(`/favorites/${characterId}`)
}

export async function removeFavorite(characterId: number): Promise<void> {
  await nodeApi.delete(`/favorites/${characterId}`)
}
