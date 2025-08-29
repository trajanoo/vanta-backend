import { Router } from "express";
import pool from "../src/db_config.js";
const router = Router();

// listar tasks de um projeto - COM ORDENAÇÃO POR PRIORIDADE
router.get("/projects/:projectId", async (req, res) => {
    const { projectId } = req.params;

    try {
        const result = await pool.query(`SELECT * FROM tasks WHERE project_id = $1`, [projectId]);
        
        if(result.rows.length === 0) {
            return res.status(404).json({ error: "nenhuma task encontrada para este projeto." });
        }

        res.json(result.rows);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// criar task
router.post("/", async (req, res) => {
    const { name, description, status, deadline, priority, project_id } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO tasks (name, description, status, deadline, priority, project_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, 
            [
                name, 
                description || null, 
                status || 'pendente', 
                deadline || null, 
                priority || 'medium', 
                project_id
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// atualizar task
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, description, status, deadline, priority } = req.body;

    try {
        // Cria arrays para montar query dinamicamente
        const fields = [];
        const values = [];
        let index = 1;

        if (name !== undefined) {
            fields.push(`name = $${index++}`);
            values.push(name);
        }
        if (description !== undefined) {
            fields.push(`description = $${index++}`);
            values.push(description);
        }
        if (status !== undefined) {
            fields.push(`status = $${index++}`);
            values.push(status);
        }
        if (deadline !== undefined) {
            fields.push(`deadline = $${index++}`);
            values.push(deadline);
        }
        if (priority !== undefined) {
            fields.push(`priority = $${index++}`);
            values.push(priority);
        }

        if (fields.length === 0) {
            return res.status(400).json({ error: "nenhum campo fornecido para atualização" });
        }

        values.push(id);
        const query = `
            UPDATE tasks SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Task não encontrada" });
        }

        res.json(result.rows[0]);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// deletar task
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "DELETE FROM tasks WHERE id = $1 RETURNING *", 
            [id]
        );
        
        if(result.rows.length === 0) {
            return res.status(404).json({ error: "Task não encontrada" });
        }

        res.json({ message: "Task deletada com sucesso" });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export default router;