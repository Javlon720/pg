import Fastify from "fastify";

import userRoutes from "./routes/user.route.js";

const app = Fastify({ logger: { level: 'info' } })

await app.register(userRoutes,{prefix:'/users'})

export default app