

async function userRoutes(fastify) {
    fastify.get('/', async (req, reply) => {
        return { message: "ok" }
    })
}

export default userRoutes