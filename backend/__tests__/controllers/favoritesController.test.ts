import { jest, describe, it, expect, beforeEach } from "@jest/globals"
import type { FastifyRequest, FastifyReply } from "fastify"
import type { Character } from "../../src/repository/favoritesRepository.js"

const mockGetAllFavorites = jest.fn<() => Promise<Character[]>>()
const mockAddFavorite = jest.fn<(character: Character) => Promise<void>>()
const mockRemoveFavorite = jest.fn<(characterId: number) => Promise<void>>()

jest.unstable_mockModule("../../src/repository/favoritesRepository.js", () => ({
  getAllFavorites: mockGetAllFavorites,
  addFavorite: mockAddFavorite,
  removeFavorite: mockRemoveFavorite,
}))

const { getFavorites, createFavorite, deleteFavorite } = await import("../../src/controllers/favoritesController.js")

describe("favoritesController", () => {
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

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("getFavorites", () => {
    it("returns favorites array", async () => {
      mockGetAllFavorites.mockResolvedValue([mockCharacter])

      const result = await getFavorites()

      expect(result).toEqual({ favorites: [mockCharacter] })
      expect(mockGetAllFavorites).toHaveBeenCalledTimes(1)
    })

    it("returns empty array when no favorites", async () => {
      mockGetAllFavorites.mockResolvedValue([])

      const result = await getFavorites()

      expect(result).toEqual({ favorites: [] })
    })
  })

  describe("createFavorite", () => {
    const createMockReply = () => {
      const reply = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      } as unknown as FastifyReply
      return reply
    }

    it("returns 201 with valid character", async () => {
      const request = {
        body: mockCharacter,
      } as FastifyRequest<{ Body: Character }>
      const reply = createMockReply()

      mockAddFavorite.mockResolvedValue()

      await createFavorite(request, reply)

      expect(reply.status).toHaveBeenCalledWith(201)
      expect(reply.send).toHaveBeenCalledWith({ success: true })
      expect(mockAddFavorite).toHaveBeenCalledWith(mockCharacter)
    })

    it("returns 400 when body is missing", async () => {
      const request = {
        body: null,
      } as unknown as FastifyRequest<{ Body: Character }>
      const reply = createMockReply()

      await createFavorite(request, reply)

      expect(reply.status).toHaveBeenCalledWith(400)
      expect(reply.send).toHaveBeenCalledWith({ error: "Invalid character data" })
      expect(mockAddFavorite).not.toHaveBeenCalled()
    })

    it("returns 400 when id is not a number", async () => {
      const request = {
        body: { ...mockCharacter, id: "not-a-number" },
      } as unknown as FastifyRequest<{ Body: Character }>
      const reply = createMockReply()

      await createFavorite(request, reply)

      expect(reply.status).toHaveBeenCalledWith(400)
      expect(reply.send).toHaveBeenCalledWith({ error: "Invalid character data" })
      expect(mockAddFavorite).not.toHaveBeenCalled()
    })
  })

  describe("deleteFavorite", () => {
    const createMockReply = () => {
      const reply = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      } as unknown as FastifyReply
      return reply
    }

    it("returns 200 with valid ID", async () => {
      const request = {
        params: { id: "1" },
      } as FastifyRequest<{ Params: { id: string } }>
      const reply = createMockReply()

      mockRemoveFavorite.mockResolvedValue()

      await deleteFavorite(request, reply)

      expect(reply.status).toHaveBeenCalledWith(200)
      expect(reply.send).toHaveBeenCalledWith({ success: true })
      expect(mockRemoveFavorite).toHaveBeenCalledWith(1)
    })

    it("returns 400 with invalid ID (NaN)", async () => {
      const request = {
        params: { id: "not-a-number" },
      } as FastifyRequest<{ Params: { id: string } }>
      const reply = createMockReply()

      await deleteFavorite(request, reply)

      expect(reply.status).toHaveBeenCalledWith(400)
      expect(reply.send).toHaveBeenCalledWith({ error: "Invalid character ID" })
      expect(mockRemoveFavorite).not.toHaveBeenCalled()
    })
  })
})
