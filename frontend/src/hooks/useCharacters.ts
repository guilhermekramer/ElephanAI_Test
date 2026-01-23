import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { getCharacters } from "@/api/rickAndMortyApi/characters"
import { useDebounce } from "./useDebounce"
import type { CharactersResponse } from "@/types/types"

export function useCharacters() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const {
    data: characters,
    isLoading,
    isError,
  } = useQuery<CharactersResponse>({
    queryKey: ["characters", page, debouncedSearch],
    queryFn: () => getCharacters(page, debouncedSearch || undefined),
  })

  const totalPages = characters?.info.pages || 1

  const nextPage = () => setPage((p) => Math.min(totalPages, p + 1))
  const prevPage = () => setPage((p) => Math.max(1, p - 1))

  return {
    characters,
    isLoading,
    isError,
    page,
    setPage,
    search,
    setSearch,
    debouncedSearch,
    totalPages,
    nextPage,
    prevPage,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}
