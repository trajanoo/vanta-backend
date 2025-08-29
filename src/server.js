import express from 'express';
import cors from 'cors';
const app = express();

import users from '../routes/users.js';

app.use(cors());
app.use(express.json());

app.use("/users", users);

app.listen(3000, () => {
    console.log("server rodando na porta 3000");
})