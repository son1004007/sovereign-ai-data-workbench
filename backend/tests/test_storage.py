from io import BytesIO
from pathlib import Path

import pymupdf
import pytest
from starlette.datastructures import UploadFile

from app.storage import resolve_artifact, store_pdf


def pdf_bytes() -> bytes:
    document = pymupdf.open()
    page = document.new_page()
    page.insert_text((72, 72), "artifact test")
    data = document.tobytes()
    document.close()
    return data


@pytest.mark.asyncio
async def test_store_pdf_hashes_and_deduplicates(tmp_path: Path) -> None:
    data = pdf_bytes()

    first = await store_pdf(UploadFile(BytesIO(data), filename="a.pdf"), tmp_path, 10_000_000)
    second = await store_pdf(UploadFile(BytesIO(data), filename="b.pdf"), tmp_path, 10_000_000)

    assert first.sha256 == second.sha256
    assert first.artifact_ref == second.artifact_ref
    assert first.absolute_path.is_file()
    assert first.byte_size == len(data)


def test_resolve_artifact_rejects_escape(tmp_path: Path) -> None:
    with pytest.raises(ValueError):
        resolve_artifact(tmp_path, "../outside.pdf")
