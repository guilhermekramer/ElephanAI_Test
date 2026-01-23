import type { FastifyInstance } from "fastify"
import {
  getFavorites,
  createFavorite,
  deleteFavorite,
} from "../controllers/favoritesController.js"

export async function favoritesRoutes(fastify: FastifyInstance) {
  fastify.get("/favorites", getFavorites)
  fastify.post("/favorites", createFavorite)
  fastify.delete("/favorites/:id", deleteFavorite)
}
