from dataclasses import dataclass
from pathlib import Path

import pymupdf


@dataclass(frozen=True)
class ExtractedSpan:
    page_number: int
    span_order: int
    x0: float
    y0: float
    x1: float
    y1: float
    text: str


@dataclass(frozen=True)
class ExtractionResult:
    parser_name: str
    parser_version: str
    spans: list[ExtractedSpan]


def extract_text_spans(pdf_path: Path) -> ExtractionResult:
    spans: list[ExtractedSpan] = []

    with pymupdf.open(pdf_path) as document:
        if document.page_count == 0:
            raise ValueError("PDF contains no pages")

        for page_index, page in enumerate(document):
            words = page.get_text("words", sort=True)
            for span_order, word in enumerate(words):
                x0, y0, x1, y1, text = word[:5]
                text = str(text).strip()
                if not text:
                    continue
                spans.append(
                    ExtractedSpan(
                        page_number=page_index + 1,
                        span_order=span_order,
                        x0=float(x0),
                        y0=float(y0),
                        x1=float(x1),
                        y1=float(y1),
                        text=text,
                    )
                )

    if not spans:
        raise ValueError("PDF has no extractable text layer; OCR/VLM is not enabled in phase 1")

    return ExtractionResult(
        parser_name="PyMuPDF",
        parser_version=str(getattr(pymupdf, "__version__", "unknown")),
        spans=spans,
    )
