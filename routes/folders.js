import { Router } from "express";
import pool from "../src/db_config";
const router = Router();

router.get("/", async (req, res) => {
    const result = await pool.query("SELECT * FROM folders");
    res.json(result.rows);
});

router.post("/", async (req, res) => {
    const { name, user_id } = req.body
    const result = await pool.query("INSERT INTO users (name, user_id) VALUES ($1, $2) RETURNING *", [name, user_id]);
    try {
        res.status(201).json(result.rows[0]);
    } catch(err) {
        res.status(500).json({ erro: err });
    }
})