import hashlib
import os
import tempfile
from dataclasses import dataclass
from pathlib import Path

from fastapi import UploadFile


@dataclass(frozen=True)
class StoredArtifact:
    sha256: str
    byte_size: int
    artifact_ref: str
    absolute_path: Path


def resolve_artifact(root: Path, artifact_ref: str) -> Path:
    root = root.resolve()
    candidate = (root / artifact_ref).resolve()
    if candidate != root and root not in candidate.parents:
        raise ValueError("artifact_ref resolves outside the configured artifact root")
    return candidate


async def store_pdf(upload: UploadFile, root: Path, max_bytes: int) -> StoredArtifact:
    root = root.resolve()
    target_dir = root / "documents"
    target_dir.mkdir(parents=True, exist_ok=True)

    digest = hashlib.sha256()
    byte_size = 0
    prefix = b""

    fd, tmp_name = tempfile.mkstemp(prefix="upload-", suffix=".tmp", dir=target_dir)
    tmp_path = Path(tmp_name)

    try:
        with os.fdopen(fd, "wb") as handle:
            while True:
                chunk = await upload.read(1024 * 1024)
                if not chunk:
                    break
                byte_size += len(chunk)
                if byte_size > max_bytes:
                    raise ValueError(f"upload exceeds max size of {max_bytes} bytes")
                if len(prefix) < 5:
                    prefix += chunk[: 5 - len(prefix)]
                digest.update(chunk)
                handle.write(chunk)

        if byte_size == 0:
            raise ValueError("empty upload")
        if prefix != b"%PDF-":
            raise ValueError("only PDF input is accepted in the first slice")

        sha256 = digest.hexdigest()
        artifact_ref = f"documents/{sha256}.pdf"
        final_path = resolve_artifact(root, artifact_ref)

        if final_path.exists():
            tmp_path.unlink(missing_ok=True)
        else:
            os.replace(tmp_path, final_path)

        return StoredArtifact(
            sha256=sha256,
            byte_size=byte_size,
            artifact_ref=artifact_ref,
            absolute_path=final_path,
        )
    except Exception:
        tmp_path.unlink(missing_ok=True)
        raise
    finally:
        await upload.close()
