import express from "express";
import cors from "cors";

const app = express();
const PY_API = process.env.PY_API_URL || "http://localhost:8000";

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

async function forward(path, body, res) {
  try {
    const r = await fetch(`${PY_API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    res.status(r.status).json(await r.json());
  } catch {
    res.status(502).json({ error: "RiskLens engine unavailable" });
  }
}

app.post("/api/chat", (req, res) => {
  const question = req.body?.question?.trim();
  if (!question) return res.status(400).json({ error: "Question is empty" });
  forward("/api/chat", { question }, res);
});

app.post("/api/predict", (req, res) => forward("/api/predict", req.body, res));

app.get("/api/health", async (req, res) => {
  try {
    const r = await fetch(`${PY_API}/api/health`);
    res.status(r.status).json(await r.json());
  } catch {
    res.status(502).json({ error: "RiskLens engine unavailable" });
  }
});

app.listen(5000, () => console.log("Server on 5000"));