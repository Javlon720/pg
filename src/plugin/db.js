import { Pool } from "pg";

import { config } from "../config/config.js";

const pool = new Pool({

    user: config.pg_user,
    password: config.pg_password,
    host: config.pg_host,
    database: config.pg_dbname,
    port: config.pg_port

})

export default pool