import { getBooksSchema, postBookSchema } from "../schema/books.schema.js"
import { getBooksController, createBookController } from "../controller/books.controller.js"

// export default bookRoutes = async (fastify) => {
//     fastify.get('/', { schema: getBookSchema }, async (req, reply) => {
//         return { message: "ok" }
//     })
//     fastify.post('/', { schema: postBookSchema }, async (req, reply) => {
//         return { message: "ok" }
//     })
// };


export default async (fastify) => {
    fastify.get('/', { schema: getBooksSchema }, getBooksController)

    fastify.post('/', { schema: postBookSchema }, createBookController)
}

