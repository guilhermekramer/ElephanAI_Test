import React from "react"
import { renderHook, waitFor, act } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { Character } from "@/types/types"
import type { ReactNode } from "react"

const mockGet = jest.fn()
const mockPost = jest.fn()
const mockDelete = jest.fn()

jest.mock("@/api/nodeApi", () => ({
  __esModule: true,
  default: {
    get: (...args: unknown[]) => mockGet(...args),
    post: (...args: unknown[]) => mockPost(...args),
    delete: (...args: unknown[]) => mockDelete(...args),
  },
}))

import { useFavorites } from "../../src/hooks/useFavorites"

describe("useFavorites", () => {
  const mockCharacter: Character = {
    id: 1,
    name: "Rick Sanchez",
    status: "Alive",
    species: "Human",
    type: "",
    gender: "Male",
    origin: { name: "Earth (C-137)", url: "https://rickandmortyapi.com/api/location/1" },
    location: { name: "Citadel of Ricks", url: "https://rickandmortyapi.com/api/location/3" },
    image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
    episode: ["https://rickandmortyapi.com/api/episode/1"],
    url: "https://rickandmortyapi.com/api/character/1",
    created: "2017-11-04T18:48:46.250Z",
  }

  const mockCharacter2: Character = {
    ...mockCharacter,
    id: 2,
    name: "Morty Smith",
  }

  let queryClient: QueryClient

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
    jest.clearAllMocks()
  })

  it("returns empty favorites initially", async () => {
    mockGet.mockResolvedValue({ data: { favorites: [] } })

    const { result } = renderHook(() => useFavorites(), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.favorites).toEqual([])
    expect(result.current.favoriteIds.size).toBe(0)
  })

  it("returns favoriteIds as Set", async () => {
    mockGet.mockResolvedValue({ data: { favorites: [mockCharacter, mockCharacter2] } })

    const { result } = renderHook(() => useFavorites(), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.favoriteIds).toBeInstanceOf(Set)
    expect(result.current.favoriteIds.has(1)).toBe(true)
    expect(result.current.favoriteIds.has(2)).toBe(true)
    expect(result.current.favoriteIds.has(3)).toBe(false)
  })

  it("isFavorite returns correct value", async () => {
    mockGet.mockResolvedValue({ data: { favorites: [mockCharacter] } })

    const { result } = renderHook(() => useFavorites(), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.isFavorite(1)).toBe(true)
    expect(result.current.isFavorite(2)).toBe(false)
  })

  it("toggleFavorite adds character when not favorite", async () => {
    mockGet.mockResolvedValue({ data: { favorites: [] } })
    mockPost.mockResolvedValue({ data: { success: true } })

    const { result } = renderHook(() => useFavorites(), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      result.current.toggleFavorite(mockCharacter)
    })

    expect(mockPost).toHaveBeenCalledWith("/favorites", mockCharacter)
  })

  it("toggleFavorite removes character when is favorite", async () => {
    mockGet.mockResolvedValue({ data: { favorites: [mockCharacter] } })
    mockDelete.mockResolvedValue({ data: { success: true } })

    const { result } = renderHook(() => useFavorites(), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.favoriteIds.has(1)).toBe(true)

    await act(async () => {
      result.current.toggleFavorite(mockCharacter)
    })

    expect(mockDelete).toHaveBeenCalledWith("/favorites/1")
  })

  it("calls mutation when toggling favorite", async () => {
    mockGet.mockResolvedValue({ data: { favorites: [] } })
    mockPost.mockResolvedValue({ data: { success: true } })

    const { result } = renderHook(() => useFavorites(), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      result.current.toggleFavorite(mockCharacter)
    })

    expect(mockPost).toHaveBeenCalledTimes(1)
    expect(mockPost).toHaveBeenCalledWith("/favorites", mockCharacter)
  })

  it("handles mutation error gracefully", async () => {
    mockGet.mockResolvedValue({ data: { favorites: [] } })
    mockPost.mockRejectedValue(new Error("Network error"))

    const { result } = renderHook(() => useFavorites(), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      result.current.toggleFavorite(mockCharacter)
    })

    expect(mockPost).toHaveBeenCalledTimes(1)
  })
})
