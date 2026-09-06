from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

import asyncpg

from .config import Settings


class Database:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self.pool: asyncpg.Pool | None = None

    async def connect(self) -> None:
        if self.pool is None:
            self.pool = await asyncpg.create_pool(self._settings.database_url, min_size=1, max_size=5)

    async def close(self) -> None:
        if self.pool is not None:
            await self.pool.close()
            self.pool = None

    def require_pool(self) -> asyncpg.Pool:
        if self.pool is None:
            raise RuntimeError("database pool is not initialized")
        return self.pool

    async def ping(self) -> bool:
        pool = self.require_pool()
        async with pool.acquire() as conn:
            return bool(await conn.fetchval("SELECT 1"))

    @asynccontextmanager
    async def connection(self) -> AsyncIterator[asyncpg.Connection]:
        pool = self.require_pool()
        async with pool.acquire() as conn:
            yield conn
