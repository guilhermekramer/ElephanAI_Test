import { MongoMemoryServer } from "mongodb-memory-server"
import { MongoClient, type Db } from "mongodb"
import { setDb } from "../../src/database/database.js"
import {
  getAllFavorites,
  addFavorite,
  removeFavorite,
  createIndexes,
  type Character,
} from "../../src/repository/favoritesRepository.js"

describe("favoritesRepository", () => {
  let mongoServer: MongoMemoryServer
  let client: MongoClient
  let db: Db

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
    id: 2,
    name: "Morty Smith",
    status: "Alive",
    species: "Human",
    type: "",
    gender: "Male",
    origin: { name: "unknown", url: "" },
    location: { name: "Citadel of Ricks", url: "https://rickandmortyapi.com/api/location/3" },
    image: "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
    episode: ["https://rickandmortyapi.com/api/episode/1"],
    url: "https://rickandmortyapi.com/api/character/2",
    created: "2017-11-04T18:50:21.651Z",
  }

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    client = new MongoClient(uri)
    await client.connect()
    db = client.db("test")
    setDb(db)
  })

  afterAll(async () => {
    await client.close()
    await mongoServer.stop()
  })

  beforeEach(async () => {
    await db.collection("favorites").deleteMany({})
  })

  describe("getAllFavorites", () => {
    it("returns empty array when no favorites", async () => {
      const favorites = await getAllFavorites()
      expect(favorites).toEqual([])
    })

    it("returns all stored favorites", async () => {
      await addFavorite(mockCharacter)
      await addFavorite(mockCharacter2)

      const favorites = await getAllFavorites()
      expect(favorites).toHaveLength(2)
      expect(favorites.map((f) => f.id)).toContain(1)
      expect(favorites.map((f) => f.id)).toContain(2)
    })
  })

  describe("addFavorite", () => {
    it("adds new character to favorites", async () => {
      await addFavorite(mockCharacter)

      const favorites = await getAllFavorites()
      expect(favorites).toHaveLength(1)
      expect(favorites[0].id).toBe(1)
      expect(favorites[0].name).toBe("Rick Sanchez")
    })

    it("updates existing favorite (upsert)", async () => {
      await addFavorite(mockCharacter)

      const updatedCharacter = { ...mockCharacter, name: "Rick C-137" }
      await addFavorite(updatedCharacter)

      const favorites = await getAllFavorites()
      expect(favorites).toHaveLength(1)
      expect(favorites[0].name).toBe("Rick C-137")
    })
  })

  describe("removeFavorite", () => {
    it("removes character by ID", async () => {
      await addFavorite(mockCharacter)
      await addFavorite(mockCharacter2)

      await removeFavorite(1)

      const favorites = await getAllFavorites()
      expect(favorites).toHaveLength(1)
      expect(favorites[0].id).toBe(2)
    })

    it("handles non-existent ID gracefully", async () => {
      await addFavorite(mockCharacter)

      await expect(removeFavorite(999)).resolves.not.toThrow()

      const favorites = await getAllFavorites()
      expect(favorites).toHaveLength(1)
    })
  })

  describe("createIndexes", () => {
    it("creates unique index on id field", async () => {
      await createIndexes()

      const indexes = await db.collection("favorites").indexes()
      const idIndex = indexes.find((idx) => idx.key && idx.key["id"] === 1)

      expect(idIndex).toBeDefined()
      expect(idIndex?.unique).toBe(true)
    })
  })
})
