# Risklens

## RiskLens RAG Pipeline

RiskLens includes a retrieval-augmented generation (RAG) pipeline
for answering credit-risk questions using a local knowledge base.

### Components

- LangChain for document processing and model integration
- Sentence Transformers for local text embeddings
- ChromaDB for vector storage and semantic retrieval
- Gemini for context-grounded answer generation
- PyPDF for extracting text from PDF documents

### Knowledge Base

Place `.txt` and text-based `.pdf` documents in:

`data/knowledge/`

### Run the Pipeline

Activate the virtual environment:

```bash
source .venv/bin/activate
```

Load and split documents:

```bash
python src/rag/ingest.py
```

Build the vector database:

```bash
python src/rag/build_vectorstore.py
```

Ask questions:

```bash
python src/rag/query_rag.py
```

### Run Tests

```bash
python -m pytest tests/test_rag.py -v
```

### Configuration and Data Safety

Set `GOOGLE_API_KEY` in a local `.env` file.
Never commit API keys, private documents, raw datasets,
processed datasets, or the generated ChromaDB database.

The RAG component explains information from retrieved documents.
It does not itself predict loan defaults.
