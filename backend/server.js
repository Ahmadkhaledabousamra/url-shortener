const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("urls.db", (err) => {
    if (err) { 
        console.error("DB error:", err.message); 
        process.exit(1); 
    }
    console.log("Connected to SQLite database");
});

db.run(`CREATE TABLE IF NOT EXISTS urls (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    shortCode TEXT NOT NULL UNIQUE,
    longUrl   TEXT NOT NULL
)`, (err) => {
    if (err) { 
        console.error("Table error:", err.message); 
        process.exit(1); 
    }
    console.log("Table ready");
});

app.post("/shorten", (req, res) => {
    let { url } = req.body;

    if (!url || url.trim() === "") {
        return res.status(400).json({ error: "URL is required" });
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
    }

    const shortCode = Math.random().toString(36).substring(2, 8);

    db.run(
        "INSERT INTO urls (shortCode, longUrl) VALUES (?, ?)",
        [shortCode, url],
        function (err) {
            if (err) return res.status(500).json({ error: "Database error: " + err.message });
            res.json({ 
                shortCode,
                shortUrl: "http://localhost:" + PORT + "/" + shortCode 
            });
        }
    );
});


app.get("/urls", (req, res) => {
    db.all("SELECT * FROM urls", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});


app.get("/:code", (req, res) => {
    const { code } = req.params;

    db.get(
        "SELECT longUrl FROM urls WHERE shortCode = ?",
        [code],
        (err, row) => {
            if (err) return res.status(500).json({ error: "Server error" });
            if (!row) return res.status(404).json({ error: "Short URL not found" });
            res.redirect(row.longUrl);
        }
    );
});

app.listen(PORT, () => console.log("Server running on http://localhost:" + PORT));