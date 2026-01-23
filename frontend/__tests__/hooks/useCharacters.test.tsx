import React from "react"
import { renderHook, waitFor, act } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { CharactersResponse, Character } from "@/types/types"
import type { ReactNode } from "react"

const mockGetCharacters = jest.fn()

jest.mock("@/api/rickAndMortyApi/characters", () => ({
  __esModule: true,
  getCharacters: (...args: unknown[]) => mockGetCharacters(...args),
}))

import { useCharacters } from "../../src/hooks/useCharacters"

describe("useCharacters", () => {
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

  const mockResponse: CharactersResponse = {
    info: {
      count: 826,
      pages: 42,
      next: "https://rickandmortyapi.com/api/character?page=2",
      prev: null,
    },
    results: [mockCharacter],
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
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("returns characters data", async () => {
    mockGetCharacters.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useCharacters(), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.characters).toEqual(mockResponse)
  })

  it("starts on page 1", async () => {
    mockGetCharacters.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useCharacters(), { wrapper })

    expect(result.current.page).toBe(1)
  })

  it("starts with empty search", async () => {
    mockGetCharacters.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useCharacters(), { wrapper })

    expect(result.current.search).toBe("")
  })

  it("setSearch updates search value", async () => {
    mockGetCharacters.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useCharacters(), { wrapper })

    act(() => {
      result.current.setSearch("Rick")
    })

    expect(result.current.search).toBe("Rick")
  })

  it("setPage updates page value", async () => {
    mockGetCharacters.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useCharacters(), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => {
      result.current.setPage(5)
    })

    expect(result.current.page).toBe(5)
  })

  it("nextPage increments page", async () => {
    mockGetCharacters.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useCharacters(), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => {
      result.current.nextPage()
    })

    expect(result.current.page).toBe(2)
  })

  it("prevPage decrements page", async () => {
    mockGetCharacters.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useCharacters(), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => {
      result.current.setPage(3)
    })

    act(() => {
      result.current.prevPage()
    })

    expect(result.current.page).toBe(2)
  })

  it("prevPage does not go below 1", async () => {
    mockGetCharacters.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useCharacters(), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => {
      result.current.prevPage()
    })

    expect(result.current.page).toBe(1)
  })

  it("calculates totalPages from response", async () => {
    mockGetCharacters.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useCharacters(), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.totalPages).toBe(42)
  })

  it("hasNextPage is true when not on last page", async () => {
    mockGetCharacters.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useCharacters(), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.hasNextPage).toBe(true)
  })

  it("hasPrevPage is false on first page", async () => {
    mockGetCharacters.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useCharacters(), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.hasPrevPage).toBe(false)
  })

  it("resets to page 1 when search changes", async () => {
    mockGetCharacters.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useCharacters(), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => {
      result.current.setPage(5)
    })

    expect(result.current.page).toBe(5)

    act(() => {
      result.current.setSearch("Morty")
    })

    act(() => {
      jest.advanceTimersByTime(300)
    })

    await waitFor(() => {
      expect(result.current.page).toBe(1)
    })
  })
})
