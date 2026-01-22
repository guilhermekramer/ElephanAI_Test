import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Character } from "@/types/types"

interface CharacterCardProps {
  character: Character
  isFavorite: boolean
  onToggleFavorite: (characterId: number) => void
  onClick?: (character: Character) => void
}

export default function CharacterCard({ character, isFavorite, onToggleFavorite, onClick }: CharacterCardProps) {
  const statusConfig = {
    Alive: { color: "bg-green-500", ring: "ring-green-500/30" },
    Dead: { color: "bg-red-500", ring: "ring-red-500/30" },
    unknown: { color: "bg-gray-400", ring: "ring-gray-400/30" }
  }

  const status = statusConfig[character.status]

  return (
    <Card
      className={cn(
        "group overflow-hidden bg-card border-0 shadow-md",
        "transition-all duration-300 ease-out",
        "hover:shadow-xl hover:-translate-y-1",
        onClick && "cursor-pointer"
      )}
      onClick={() => onClick?.(character)}
    >
      <div className="relative overflow-hidden">
        <img
          src={character.image}
          alt={character.name}
          className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-3 right-3 rounded-full backdrop-blur-sm",
            "bg-white/20 hover:bg-white/40 border border-white/30",
            "transition-all duration-200 hover:scale-110"
          )}
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite(character.id)
          }}
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-all duration-200",
              isFavorite
                ? "fill-red-500 text-red-500 scale-110"
                : "text-white hover:text-red-400"
            )}
          />
        </Button>

        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              "h-2.5 w-2.5 rounded-full ring-4",
              status.color,
              status.ring
            )} />
            <span className="text-xs font-medium text-white/90 uppercase tracking-wide">
              {character.status} - {character.species}
            </span>
          </div>
          <h3 className="font-bold text-lg text-white truncate drop-shadow-lg" title={character.name}>
            {character.name}
          </h3>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-start gap-2 text-base text-muted-foreground">
          <MapPin className="h-5 w-5 mt-0.5 shrink-0" />
          <span className="truncate" title={character.location.name}>
            {character.location.name}
          </span>
        </div>
        <p className="text-sm text-muted-foreground/80">
          Featured in {character.episode.length} episode{character.episode.length !== 1 ? 's' : ''}
        </p>
      </div>
    </Card>
  )
}
