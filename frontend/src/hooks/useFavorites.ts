import { useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import nodeApi from "@/api/nodeApi"
import type { Character } from "@/types/types"

export function useFavorites() {
  const queryClient = useQueryClient()

  const { data: favorites, isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const { data } = await nodeApi.get<{ favorites: Character[] }>("/favorites")
      return data.favorites
    },
  })

  const favoriteIds = useMemo(
    () => new Set(favorites?.map((c) => c.id) || []),
    [favorites]
  )

  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({
      character,
      isFavorite,
    }: {
      character: Character
      isFavorite: boolean
    }) => {
      if (isFavorite) {
        await nodeApi.delete(`/favorites/${character.id}`)
      } else {
        await nodeApi.post("/favorites", character)
      }
    },
    onMutate: async ({ character, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] })
      const previousFavorites = queryClient.getQueryData<Character[]>(["favorites"])

      queryClient.setQueryData<Character[]>(["favorites"], (old) => {
        if (!old) return isFavorite ? [] : [character]
        if (isFavorite) {
          return old.filter((c) => c.id !== character.id)
        }
        return [...old, character]
      })

      return { previousFavorites }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(["favorites"], context.previousFavorites)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] })
    },
  })

  const toggleFavorite = (character: Character) => {
    toggleFavoriteMutation.mutate({
      character,
      isFavorite: favoriteIds.has(character.id),
    })
  }

  const isFavorite = (characterId: number) => favoriteIds.has(characterId)

  return {
    favorites,
    favoriteIds,
    isLoading,
    toggleFavorite,
    isFavorite,
  }
}

export default useFavorites
