import { Pool } from "pg";
// import dotenv from 'dotenv'

// dotenv.config();
const pool=new Pool({
    user:process.env.DB_USERNAME,
    host:process.env.DB_HOST,
    database:process.env.DB_DATABASE,
    password:process.env.DB_PASSWORD,
    port:process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: process.env.DB_SSL_MODE !== 'disable', // Set rejectUnauthorized based on DB_SSL_MODE
      },

})

export default pool;