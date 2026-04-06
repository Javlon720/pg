import { getCategoriesSchema, postCategorySchema } from '../schema/categories.schema.js'
import { getCategoriesController, createCategoryController } from '../controller/categories.controller.js'

export default async function categoryRoutes(fastify) {
  fastify.get('/', { schema: getCategoriesSchema }, getCategoriesController)
  fastify.post('/', { schema: postCategorySchema }, createCategoryController)
}
