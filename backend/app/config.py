from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="WORKBENCH_", case_sensitive=False)

    database_url: str = "postgresql://workbench:workbench@127.0.0.1:5432/workbench"
    artifact_root: Path = Path("./var/artifacts")
    max_upload_bytes: int = Field(default=50 * 1024 * 1024, ge=1)
    worker_id: str = "local-worker"

    def normalized_artifact_root(self) -> Path:
        root = self.artifact_root.expanduser().resolve()
        root.mkdir(parents=True, exist_ok=True)
        return root


@lru_cache
def get_settings() -> Settings:
    return Settings()
