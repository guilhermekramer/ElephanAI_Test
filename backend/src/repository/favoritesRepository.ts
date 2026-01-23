import { getDb } from "../database/database.js"

interface Favorite {
  characterId: number
}

const COLLECTION_NAME = "favorites"

function getCollection() {
  const db = getDb()
  if(!db){
    throw new Error("[repository] Database not initialized")
  }
  return db.collection<Favorite>(COLLECTION_NAME)
}

export async function getAllFavorites(): Promise<number[]> {
  const favorites = await getCollection().find({}).toArray()
  return favorites.map((f) => f.characterId)
}

export async function addFavorite(characterId: number): Promise<void> {
  await getCollection().updateOne(
    { characterId },
    { $set: { characterId } },
    { upsert: true }
  )
}

export async function removeFavorite(characterId: number): Promise<void> {
  await getCollection().deleteOne({ characterId })
}

export async function createIndexes(): Promise<void> {
  await getCollection().createIndex({ characterId: 1 }, { unique: true })
}
