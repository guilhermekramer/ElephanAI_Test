import { getDb } from "../database/database.js"

interface CharacterOrigin {
  name: string
  url: string
}

interface CharacterLocation {
  name: string
  url: string
}

export interface Character {
  id: number
  name: string
  status: "Alive" | "Dead" | "unknown"
  species: string
  type: string
  gender: "Female" | "Male" | "Genderless" | "unknown"
  origin: CharacterOrigin
  location: CharacterLocation
  image: string
  episode: string[]
  url: string
  created: string
}

const COLLECTION_NAME = "favorites"

function getCollection() {
  const db = getDb()
  if (!db) {
    throw new Error("[repository] Database not initialized")
  }
  return db.collection<Character>(COLLECTION_NAME)
}

export async function getAllFavorites(): Promise<Character[]> {
  return await getCollection().find({}).toArray()
}

export async function addFavorite(character: Character): Promise<void> {
  await getCollection().updateOne(
    { id: character.id },
    { $set: character },
    { upsert: true }
  )
}

export async function removeFavorite(characterId: number): Promise<void> {
  await getCollection().deleteOne({ id: characterId })
}

export async function createIndexes(): Promise<void> {
  await getCollection().createIndex({ id: 1 }, { unique: true })
}
