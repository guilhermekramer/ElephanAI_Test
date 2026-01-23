import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MapPin, Tv, Heart } from "lucide-react"
import CharacterCard from "@/components/CharacterCard"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useFavorites } from "@/hooks"
import type { Character } from "@/types/types"
import { cn } from "@/lib/utils"

export default function FavoritesPage() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)

  const { favorites, favoriteIds, isLoading, toggleFavorite } = useFavorites()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Home</span>
              </Button>
            </Link>
            <ThemeToggle />
          </div>
          <div className="text-center">
            <h1 className="text-2xl sm:text-4xl font-bold text-foreground flex items-center justify-center gap-2">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 fill-red-500 text-red-500" />
              My Favorites
            </h1>
            <p className="text-muted-foreground mt-2">
              {favoriteIds.size} character{favoriteIds.size !== 1 ? 's' : ''} saved
            </p>
          </div>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : favoriteIds.size === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-lg mb-4">
              You haven't added any favorites yet
            </p>
            <Link to="/">
              <Button>Browse Characters</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {favorites?.map((character, index) => (
              <div
                key={character.id}
                className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
                style={{ animationDelay: `${index * 50}ms`, animationDuration: "400ms" }}
              >
                <CharacterCard
                  character={character}
                  isFavorite={favoriteIds.has(character.id)}
                  onToggleFavorite={toggleFavorite}
                  onClick={setSelectedCharacter}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedCharacter} onOpenChange={(open) => !open && setSelectedCharacter(null)}>
        <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-xl p-4 sm:p-8 bg-card text-card-foreground">
          {selectedCharacter && (
            <>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <img
                  src={selectedCharacter.image}
                  alt={selectedCharacter.name}
                  className="w-24 h-24 sm:w-40 sm:h-40 rounded-lg object-cover shrink-0 mx-auto sm:mx-0"
                />
                <div className="flex flex-col justify-center min-w-0 text-center sm:text-left">
                  <DialogHeader className="space-y-1">
                    <DialogTitle className="text-xl sm:text-3xl font-bold truncate text-foreground">
                      {selectedCharacter.name}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                    <span className={cn(
                      "h-3 w-3 rounded-full shrink-0",
                      selectedCharacter.status === "Alive" && "bg-green-500",
                      selectedCharacter.status === "Dead" && "bg-red-500",
                      selectedCharacter.status === "unknown" && "bg-gray-400"
                    )} />
                    <span className="text-sm sm:text-base text-muted-foreground">
                      {selectedCharacter.status} - {selectedCharacter.species}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground mt-1">{selectedCharacter.gender}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground uppercase tracking-wide">
                    <MapPin className="h-4 w-4" />
                    Origin
                  </div>
                  <p className="text-base sm:text-lg font-medium text-foreground">{selectedCharacter.origin.name}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground uppercase tracking-wide">
                    <MapPin className="h-4 w-4" />
                    Last Known Location
                  </div>
                  <p className="text-base sm:text-lg font-medium text-foreground">{selectedCharacter.location.name}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground uppercase tracking-wide">
                    <Tv className="h-4 w-4" />
                    Episodes
                  </div>
                  <p className="text-base sm:text-lg font-medium text-foreground">Featured in {selectedCharacter.episode.length} episode{selectedCharacter.episode.length !== 1 ? 's' : ''}</p>
                </div>
              </div>

              <Button
                className="w-full"
                variant={favoriteIds.has(selectedCharacter.id) ? "secondary" : "default"}
                onClick={() => toggleFavorite(selectedCharacter)}
              >
                <Heart className={cn(
                  "h-4 w-4 mr-2",
                  favoriteIds.has(selectedCharacter.id) && "fill-current"
                )} />
                {favoriteIds.has(selectedCharacter.id) ? "Remove from Favorites" : "Add to Favorites"}
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
