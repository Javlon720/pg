import Fastify from "fastify";

import indexRoutes from "./routes/index.route.js";

const app = Fastify({ logger: { level: 'info' } })

await app.register(indexRoutes,{prefix:'/data.uz'})



export default app