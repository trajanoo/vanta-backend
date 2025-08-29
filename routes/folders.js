import { Router } from "express";
import pool from "../src/db_config.js";
const router = Router();

router.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await pool.query("SELECT id, name FROM folders WHERE user_id = $1", [userId]);
        if(result.rows.length === 0) {
            return res.status(404).json({ error: "nenhuma pasta encontrada para este usuário." });
        }

        res.json(result.rows);
    } catch(err) {
        res.status(500).json({ error: err });
    }
});

router.post("/", async (req, res) => {
    try {
        const { name, user_id } = req.body;
        const result = await pool.query("INSERT INTO folders (name, user_id) VALUES($1, $2) RETURNING *", [name, user_id]);
        res.status(201).json(result.rows[0]);
    } catch(err) {
        res.status(500).json({ error: err });
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const result = await pool.query("UPDATE folders SET name = $1 WHERE id = $2 RETURNING *", [name, id]);
        if(result.rows.length === 0) {
           return res.status(404).json({ error: "pasta não encontrada"});
        }

        res.json(result.rows[0]);
    } catch(err) {
        console.error(err.message);
        res.status(500).json({ error: err });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("DELETE FROM folders WHERE id = $1 RETURNING *", [id]);
        if(result.rows.length === 0) {
            return res.status(404).json({ error: "pasta não encontrada" });
        }

        res.json({ message: "pasta deletada" });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
});

export default router;