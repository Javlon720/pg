async function satatusRoutes(fastify) {
    
    fastify.get('/', async (req, reply) => {
        return { message: "data.uz ishlayapdi" }
    })
}

export default satatusRoutes