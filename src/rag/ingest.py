
from pathlib import Path

from pypdf import PdfReader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

PROJECT_ROOT = Path(__file__).resolve().parents[2]
KNOWLEDGE_DIR = PROJECT_ROOT / "data" / "knowledge"


def load_documents():
    documents = []

    for file_path in KNOWLEDGE_DIR.iterdir():
        if not file_path.is_file():
            continue

        if file_path.suffix.lower() == ".txt":
            text = file_path.read_text(encoding="utf-8")

            if text.strip():
                documents.append(
                    Document(
                        page_content=text,
                        metadata={"source": file_path.name},
                    )
                )

        elif file_path.suffix.lower() == ".pdf":
            reader = PdfReader(str(file_path))

            for page_number, page in enumerate(reader.pages, start=1):
                text = page.extract_text() or ""

                if text.strip():
                    documents.append(
                        Document(
                            page_content=text,
                            metadata={
                                "source": file_path.name,
                                "page": page_number,
                            },
                        )
                    )

    return documents


def split_documents(documents):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=80,
    )
    return splitter.split_documents(documents)


if __name__ == "__main__":
    documents = load_documents()
    chunks = split_documents(documents)

    print(f"Document pages/sections loaded: {len(documents)}")
    print(f"Chunks created: {len(chunks)}")

    for index, chunk in enumerate(chunks, start=1):
        print(f"\n--- Chunk {index} ---")
        print(chunk.page_content)
        print("Metadata:", chunk.metadata)
