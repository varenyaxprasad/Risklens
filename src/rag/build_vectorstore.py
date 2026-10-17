
from pathlib import Path

from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

from ingest import load_documents, split_documents

PROJECT_ROOT = Path(__file__).resolve().parents[2]
CHROMA_DIR = PROJECT_ROOT / "data" / "chroma_db"

def main():
    documents = load_documents()
    chunks = split_documents(documents)

    if not chunks:
        raise ValueError(
            "No text chunks found. Add .txt files to data/knowledge first."
        )

    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=str(CHROMA_DIR),
        collection_name="risklens_knowledge",
    )

    print(f"Documents loaded: {len(documents)}")
    print(f"Chunks stored: {len(chunks)}")
    print(f"Vector database: {CHROMA_DIR}")

    results = vectorstore.similarity_search(
        "What factors influence whether a borrower repays a loan?",
        k=3,
    )

    print("\n--- Similarity Search Results ---")
    for result in results:
        print(f"\nSource: {result.metadata.get('source')}")
        print(result.page_content)


if __name__ == "__main__":
    main()
