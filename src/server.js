import express from 'express';
import cors from 'cors';
const app = express();

import users from '../routes/users.js';
import folders from '../routes/folders.js';
import projects from '../routes/projects.js';
import tasks from '../routes/tasks.js';

app.use(cors());
app.use(express.json());

app.use("/users", users);
app.use("/folders", folders);
app.use("/projects", projects);
app.use("/tasks", tasks);

app.listen(3000, () => {
    console.log("server rodando na porta 3000");
});