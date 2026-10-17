
from langchain_core.documents import Document

from src.rag.ingest import split_documents


def test_split_documents_returns_chunks():
    documents = [
        Document(
            page_content=(
                "Credit risk measures the possibility that a borrower "
                "will not repay a loan. " * 30
            ),
            metadata={"source": "test.txt"},
        )
    ]

    chunks = split_documents(documents)

    assert len(chunks) > 1
    assert all(chunk.page_content.strip() for chunk in chunks)


def test_split_documents_preserves_source():
    documents = [
        Document(
            page_content="Credit scores help assess creditworthiness. " * 20,
            metadata={"source": "credit_test.txt"},
        )
    ]

    chunks = split_documents(documents)

    assert chunks
    assert all(
        chunk.metadata["source"] == "credit_test.txt"
        for chunk in chunks
    )
