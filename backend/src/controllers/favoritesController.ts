import type { FastifyRequest, FastifyReply } from "fastify"
import {
  getAllFavorites,
  addFavorite,
  removeFavorite,
} from "../repository/favoritesRepository.js"

interface IdParams {
  id: string
}

export async function getFavorites() {
  const favorites = await getAllFavorites()
  return { favorites }
}

export async function createFavorite(
  request: FastifyRequest<{ Params: IdParams }>,
  reply: FastifyReply
) {
  const characterId = parseInt(request.params.id, 10)
  if (isNaN(characterId)) {
    return reply.status(400).send({ error: "Invalid character ID" })
  }
  await addFavorite(characterId)
  return reply.status(201).send({ success: true })
}

export async function deleteFavorite(
  request: FastifyRequest<{ Params: IdParams }>,
  reply: FastifyReply
) {
  const characterId = parseInt(request.params.id, 10)
  if (isNaN(characterId)) {
    return reply.status(400).send({ error: "Invalid character ID" })
  }
  await removeFavorite(characterId)
  return reply.status(200).send({ success: true })
}
