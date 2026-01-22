import { useState, useEffect, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, ChevronRight, Search, X, MapPin, Tv, Heart } from "lucide-react"
import CharacterCard from "@/components/CharacterCard"
import { ThemeToggle } from "@/components/ThemeToggle"
import { getCharacters } from "@/api/rickAndMortyApi/characters"
import nodeApi from "@/api/nodeApi"
import type { Character } from "@/types/types"
import { cn } from "@/lib/utils"

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

export default function HomePage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const debouncedSearch = useDebounce(search, 300)
  const queryClient = useQueryClient()

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const { data: charactersData, isLoading: isLoadingCharacters, isError: isCharactersError } = useQuery({
    queryKey: ["characters", page, debouncedSearch],
    queryFn: () => getCharacters(page, debouncedSearch || undefined),
  })

  const { data: favoritesData } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const { data } = await nodeApi.get<{ favorites: number[] }>("/favorites")
      return data.favorites
    },
  })

  const favorites = useMemo(() => new Set(favoritesData || []), [favoritesData])

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (characterId: number) => {
      if (favorites.has(characterId)) {
        await nodeApi.delete(`/favorites/${characterId}`)
      } else {
        await nodeApi.post(`/favorites/${characterId}`)
      }
    },
    onMutate: async (characterId: number) => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] })
      const previousFavorites = queryClient.getQueryData<number[]>(["favorites"])

      queryClient.setQueryData<number[]>(["favorites"], (old) => {
        if (!old) return [characterId]
        if (old.includes(characterId)) {
          return old.filter(id => id !== characterId)
        }
        return [...old, characterId]
      })

      return { previousFavorites }
    },
    onError: (_err, _characterId, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(["favorites"], context.previousFavorites)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] })
    },
  })

  const handleToggleFavorite = (characterId: number) => {
    toggleFavoriteMutation.mutate(characterId)
  }

  const totalPages = charactersData?.info.pages || 1

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <h1 className="text-4xl font-bold text-center mb-6 text-foreground">Rick and Morty Characters</h1>
          <div className="relative max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Search characters..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 pr-12 h-12 rounded-full shadow-lg border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {search && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 h-8 w-8 rounded-full"
                  onClick={() => setSearch("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </header>

        {isLoadingCharacters ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : isCharactersError ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {debouncedSearch ? `No characters found for "${debouncedSearch}"` : "Failed to load characters"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {charactersData?.results.map((character, index) => (
                <div
                  key={character.id}
                  className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
                  style={{ animationDelay: `${index * 50}ms`, animationDuration: "400ms" }}
                >
                  <CharacterCard
                    character={character}
                    isFavorite={favorites.has(character.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onClick={setSelectedCharacter}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center gap-4 mt-8">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </>
        )}
      </div>

      <Dialog open={!!selectedCharacter} onOpenChange={(open) => !open && setSelectedCharacter(null)}>
        <DialogContent className="sm:max-w-xl p-8 bg-card text-card-foreground">
          {selectedCharacter && (
            <>
              <div className="flex gap-6">
                <img
                  src={selectedCharacter.image}
                  alt={selectedCharacter.name}
                  className="w-40 h-40 rounded-lg object-cover shrink-0"
                />
                <div className="flex flex-col justify-center min-w-0">
                  <DialogHeader className="space-y-1">
                    <DialogTitle className="text-3xl font-bold truncate text-foreground">
                      {selectedCharacter.name}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={cn(
                      "h-3 w-3 rounded-full shrink-0",
                      selectedCharacter.status === "Alive" && "bg-green-500",
                      selectedCharacter.status === "Dead" && "bg-red-500",
                      selectedCharacter.status === "unknown" && "bg-gray-400"
                    )} />
                    <span className="text-base text-muted-foreground">
                      {selectedCharacter.status} - {selectedCharacter.species}
                    </span>
                  </div>
                  <p className="text-base text-muted-foreground mt-1">{selectedCharacter.gender}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                    <MapPin className="h-4 w-4" />
                    Origin
                  </div>
                  <p className="text-lg font-medium text-foreground">{selectedCharacter.origin.name}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                    <MapPin className="h-4 w-4" />
                    Last Known Location
                  </div>
                  <p className="text-lg font-medium text-foreground">{selectedCharacter.location.name}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                    <Tv className="h-4 w-4" />
                    Episodes
                  </div>
                  <p className="text-lg font-medium text-foreground">Featured in {selectedCharacter.episode.length} episode{selectedCharacter.episode.length !== 1 ? 's' : ''}</p>
                </div>
              </div>

              <Button
                className="w-full"
                variant={favorites.has(selectedCharacter.id) ? "secondary" : "default"}
                onClick={() => handleToggleFavorite(selectedCharacter.id)}
              >
                <Heart className={cn(
                  "h-4 w-4 mr-2",
                  favorites.has(selectedCharacter.id) && "fill-current"
                )} />
                {favorites.has(selectedCharacter.id) ? "Remove from Favorites" : "Add to Favorites"}
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
