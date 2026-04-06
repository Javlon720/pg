import { getUsersSchema, postUserSchema } from '../schema/users.schema.js'
import { getUsersController, createUserController } from '../controller/users.controller.js'

export default async function userRoutes(fastify) {
  fastify.get('/', { schema: getUsersSchema }, getUsersController)
  fastify.post('/', { schema: postUserSchema }, createUserController)
}
