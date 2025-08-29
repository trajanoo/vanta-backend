import { Pool } from "pg";
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: 5432
});

pool.connect((err, client, release) => {
    if(err) {
        console.log("erro ao conectar com db: " + err);
    }

    release();
    console.log("conectado com sucesso ao db!");
});

export default pool;