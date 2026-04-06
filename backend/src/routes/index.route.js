import userRoutes from "./user.route.js";
import categoryRoutes from "./category.route.js";
import bookRoutes from "./books.route.js";
import satatusRoutes from "./status.route.js";


// export default async (app) => {
//     app.register(async (child) => {
//         child.register(userRoutes, { prefix: '/users' })
//         child.register(categoryRoutes, { prefix: '/categories' })
//         child.register(bookRoutes, { prefix: '/books' })
//     }, { prefix: '/kun.uz' })
// }


export default async (fastify) => {

    fastify.register(satatusRoutes, { prefix: '/' })
    fastify.register(userRoutes, { prefix: '/users' })
    fastify.register(categoryRoutes, { prefix: '/categories' })
    fastify.register(bookRoutes, { prefix: '/books' })

}