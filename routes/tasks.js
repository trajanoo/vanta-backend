import { Router } from "express";
import pool from "../src/db_config.js";
const router = Router();

// listar tasks de um projeto
router.get("/projects/:projectId", async (req, res) => {
    const { projectId } = req.params;

    try {
        const result = await pool.query("SELECT * FROM tasks WHERE project_id = $1", [projectId]);
        if(result.rows.length === 0) {
            return res.status(404).json({ error: "nenhuma task encontrada para este projeto." });
        }

        res.json(result.rows);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.post("/", async (req, res) => {
    const { name, description, status, deadline, project_id } = req.body;

    try {
        const result = await pool.query("INSERT INTO tasks (name, description, status, deadline, project_id) VALUES ($1, $2, $3, $4, $5) RETURNING *", [name, description, status, deadline, project_id]);

        res.status(201).json(result.rows[0]);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.put("/:id", async (req, res) => {
    const { name, description, status, deadline } = req.body;
    const { id } = req.params;

    try {
        const result = await pool.query("UPDATE tasks SET name = $1, description = $2, status = $3, deadline = $4 WHERE id = $5 RETURNING *", [name, description, status, deadline, id]);
        if(result.rows.length === 0) {
            return res.status(404).json({ error: "nenhuma tarefa encontrada." });
        }

        res.json(result.rows[0]);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("DELETE FROM tasks WHERE id = $1 RETURNING *", [id]);
        if(result.rows.length === 0) {
            return res.status(404).json({ error: "tarefa não encontrada" });
        }

        res.json({ message: "tarefa deletada" });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
})

export default router;
