from pathlib import Path

import pymupdf

from app.pdf_extractor import extract_text_spans


def make_text_pdf(path: Path) -> None:
    document = pymupdf.open()
    page = document.new_page(width=300, height=200)
    page.insert_text((50, 80), "Hello sovereign workbench")
    document.save(path)
    document.close()


def test_extract_text_spans_preserves_page_and_bbox(tmp_path: Path) -> None:
    pdf_path = tmp_path / "sample.pdf"
    make_text_pdf(pdf_path)

    result = extract_text_spans(pdf_path)

    assert result.parser_name == "PyMuPDF"
    assert result.spans
    assert {span.page_number for span in result.spans} == {1}
    assert "Hello" in [span.text for span in result.spans]
    for span in result.spans:
        assert span.x1 >= span.x0
        assert span.y1 >= span.y0


def test_extract_text_spans_rejects_no_text_layer(tmp_path: Path) -> None:
    pdf_path = tmp_path / "blank.pdf"
    document = pymupdf.open()
    document.new_page()
    document.save(pdf_path)
    document.close()

    try:
        extract_text_spans(pdf_path)
    except ValueError as exc:
        assert "no extractable text layer" in str(exc)
    else:
        raise AssertionError("blank PDF should fail phase-1 extraction")
