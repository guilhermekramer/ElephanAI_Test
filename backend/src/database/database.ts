import { MongoClient, type Db } from "mongodb"

const MONGO_URI = process.env["MONGO_URI"] ?? "mongodb://localhost:27017"
const DB_NAME = process.env["DB_NAME"]

let client: MongoClient | null = null
let db: Db | null = null

export async function connect(): Promise<Db> {
  if (db) return db
  client = new MongoClient(MONGO_URI)
  await client.connect()
  db = client.db(DB_NAME)
  return db
}

export async function disconnect(): Promise<void> {
  await client?.close()
  client = null
  db = null
}

export function getDb(): Db {
  if (!db) throw new Error("Database not connected")
  return db
}
