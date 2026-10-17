
from pathlib import Path

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

PROJECT_ROOT = Path(__file__).resolve().parents[2]
CHROMA_DIR = PROJECT_ROOT / "data" / "chroma_db"

load_dotenv(PROJECT_ROOT / ".env")


def main():
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    vectorstore = Chroma(
        persist_directory=str(CHROMA_DIR),
        embedding_function=embeddings,
        collection_name="risklens_knowledge",
    )

    model = ChatGoogleGenerativeAI(
        model="gemini-3.8-flash",
        temperature=0,
    )

    print("RiskLens RAG is ready. Type 'exit' to quit.")

    while True:
        question = input("\nAsk a credit-risk question: ").strip()

        if question.lower() in {"exit", "quit"}:
            break

        if not question:
            continue

        documents = vectorstore.similarity_search(question, k=3)

        if not documents:
            print("No relevant information was found in the knowledge base.")
            continue

        context = "\n\n".join(
            f"Source: {doc.metadata.get('source', 'Unknown')}\n"
            f"{doc.page_content}"
            for doc in documents
        )

        prompt = f"""
You are RiskLens, a credit-risk information assistant.

Answer using only the context below.
If the context does not contain enough information, say so.
Do not invent lending policies or claim that a person will default.

Context:
{context}

Question:
{question}

Give a clear, concise answer. Mention the source filenames used.
"""

        response = model.invoke(prompt)

        content = response.content

        if isinstance(content, list):
            answer = "\n".join(
                block["text"]
                for block in content
                if isinstance(block, dict)
                and block.get("type") == "text"
            )
        else:
            answer = str(content)

        print("\nRiskLens:", answer)
        print("\nRetrieved sources:")
        for doc in documents:
            print("-", doc.metadata.get("source", "Unknown"))


if __name__ == "__main__":
    main()

