import Fastify from "fastify";
import cors from "@fastify/cors";

import indexRoutes from "./routes/index.route.js";

const app = Fastify({ logger: { level: 'info' } })


await app.register(cors, {
    origin: "http://localhost:7654/",
    methods: ["GET", "POST"]
})

await app.register(indexRoutes, { prefix: '/data.uz' })



export default app