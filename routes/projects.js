import { Router } from "express";
import pool from "../src/db_config.js";
const router = Router();

// listar projetos de uma folder
router.get("/folders/:folderId", async (req, res) => {
    const { folderId } = req.params;
    try {
        const result = await pool.query("SELECT * FROM projects WHERE folder_id = $1", [folderId]);
        if(result.rows.length === 0) {
            return res.status(404).json({ error: "nenhum projeto encontrado para essa pasta." })
        }

        res.json(result.rows);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
})

//criar projeto
router.post("/", async (req, res) => {
    const { name, description, folder_id } = req.body

    try {
        const result = await pool.query("INSERT INTO projects (name, description, folder_id) VALUES ($1, $2, $3) RETURNING *", [name, description, folder_id]);
        res.status(201).json(result.rows[0]);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
});

// atualizar projeto
router.put("/:id", async (req, res) => {
    const { id } = req.params
    const { name, description } = req.body

    try {
        const result = await pool.query("UPDATE projects SET name = $1, description = $2 WHERE id = $3 RETURNING *", [name, description, id]);
        if(result.rows.length === 0) {
            return res.status(404).json({ error: "projeto não encontrado" });
        }

        res.json(result.rows[0]);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("DELETE FROM projects WHERE id = $1 RETURNING *", [id]);
        if(result.rows.length === 0) {
            return res.status(404).json({ error: "projeto não encontrado. "});
        }
        res.json({ message: "projeto deletado" });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
});

export default router;