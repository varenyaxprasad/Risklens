from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.rag.query_rag import answer_question

try:
    from src.ml.predict import predict_default
    MODEL_MODE = "trained"
except ImportError:
    from api.predict_stub import predict_default
    MODEL_MODE = "demo"

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class Question(BaseModel):
    question: str


@app.post("/api/chat")
def chat(q: Question):
    if not q.question.strip():
        raise HTTPException(status_code=400, detail="Question is empty")
    return answer_question(q.question.strip())


@app.post("/api/predict")
def predict(features: dict):
    return predict_default(features)

@app.get("/api/health")
def health():
    return {"status": "ok", "model": MODEL_MODE}