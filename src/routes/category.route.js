import dbUser from '../plugin/db.js'

async function categoryRoutes(fastify) {
    fastify.get('/', async (req, reply) => {
        return { message: "ok" }
    })
}

export default categoryRoutes