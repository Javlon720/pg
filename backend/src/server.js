import app from './app.js'
import { config } from './config/config.js'



const start = async () => {
    try {
        await app.listen({
            port: config.port,
            host: '0.0.0.0'
        })
        console.log(`server already on ${config.port}`);

    } catch (error) {
        process.exit(1)
    }
}


await start()

