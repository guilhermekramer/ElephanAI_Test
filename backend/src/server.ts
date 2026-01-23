import fastify from "fastify"
import cors from "@fastify/cors"
import { connect } from "./repository/database"
import { createIndexes } from "./repository/favoritesRepository"
import { favoritesRoutes } from "./routes/favorites"

const server = fastify()

async function start() {
  await server.register(cors, {
    origin: true,
  })

  await connect()
  await createIndexes()

  await server.register(favoritesRoutes)

  server.get("/ping", async () => {
    return "pong\n"
  })

  server.listen({ port: 8080 }, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  })
}

start()
