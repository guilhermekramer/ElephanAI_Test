import type { FastifyInstance } from "fastify"
import {
  getAllFavorites,
  addFavorite,
  removeFavorite,
} from "../repository/favoritesRepository"

interface IdParams {
  id: string
}

export async function favoritesRoutes(fastify: FastifyInstance) {
  fastify.get("/favorites", async () => {
    const favorites = await getAllFavorites()
    return { favorites }
  })

  fastify.post<{ Params: IdParams }>("/favorites/:id", async (request, reply) => {
    const characterId = parseInt(request.params.id, 10)
    if (isNaN(characterId)) {
      return reply.status(400).send({ error: "Invalid character ID" })
    }
    await addFavorite(characterId)
    return reply.status(201).send({ success: true })
  })

  fastify.delete<{ Params: IdParams }>("/favorites/:id", async (request, reply) => {
    const characterId = parseInt(request.params.id, 10)
    if (isNaN(characterId)) {
      return reply.status(400).send({ error: "Invalid character ID" })
    }
    await removeFavorite(characterId)
    return reply.status(200).send({ success: true })
  })
}
