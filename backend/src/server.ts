import fastify from "fastify"
import cors from "@fastify/cors"
import { connect } from "./database/database.js"
import { createIndexes } from "./repository/favoritesRepository.js"
import { favoritesRoutes } from "./routes/favorites.js"

const server = fastify()

async function start() {
  await server.register(cors, {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })

  await connect()
  await createIndexes()

  await server.register(favoritesRoutes)

  server.get("/ping", async () => {
    return "pong\n"
  })

  server.listen({ port: 8080, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  })
}

start()
