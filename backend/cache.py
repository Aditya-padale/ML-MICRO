"""
Redis cache configuration and utilities.
"""
import json
import pickle
from typing import Any, Optional, Union
import redis.asyncio as redis
import structlog

from .config import settings

logger = structlog.get_logger()

class CacheManager:
    """Redis cache manager for the application."""
    
    def __init__(self):
        self.redis_client: Optional[redis.Redis] = None
    
    async def init(self):
        """Initialize Redis connection."""
        try:
            self.redis_client = redis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=False,  # We'll handle encoding ourselves
                max_connections=20,
                socket_keepalive=True,
                socket_keepalive_options={}
            )
            # Test connection
            await self.redis_client.ping()
            logger.info("Redis cache initialized successfully")
        except Exception as e:
            logger.error("Redis cache initialization failed", exc_info=e)
            raise
    
    async def close(self):
        """Close Redis connection."""
        if self.redis_client:
            await self.redis_client.close()
            logger.info("Redis cache connection closed")
    
    async def set(
        self, 
        key: str, 
        value: Any, 
        ttl: Optional[int] = None,
        serialize: str = "json"
    ) -> bool:
        """Set a value in cache."""
        if not self.redis_client:
            return False
        
        try:
            if serialize == "json":
                serialized_value = json.dumps(value, default=str)
            elif serialize == "pickle":
                serialized_value = pickle.dumps(value)
            else:
                serialized_value = str(value)
            
            await self.redis_client.set(
                key, 
                serialized_value, 
                ex=ttl or settings.CACHE_TTL
            )
            return True
        except Exception as e:
            logger.error("Cache set error", key=key, exc_info=e)
            return False
    
    async def get(
        self, 
        key: str, 
        serialize: str = "json"
    ) -> Optional[Any]:
        """Get a value from cache."""
        if not self.redis_client:
            return None
        
        try:
            value = await self.redis_client.get(key)
            if value is None:
                return None
            
            if serialize == "json":
                return json.loads(value)
            elif serialize == "pickle":
                return pickle.loads(value)
            else:
                return value.decode('utf-8') if isinstance(value, bytes) else value
        except Exception as e:
            logger.error("Cache get error", key=key, exc_info=e)
            return None
    
    async def delete(self, key: str) -> bool:
        """Delete a key from cache."""
        if not self.redis_client:
            return False
        
        try:
            result = await self.redis_client.delete(key)
            return result > 0
        except Exception as e:
            logger.error("Cache delete error", key=key, exc_info=e)
            return False
    
    async def exists(self, key: str) -> bool:
        """Check if a key exists in cache."""
        if not self.redis_client:
            return False
        
        try:
            result = await self.redis_client.exists(key)
            return result > 0
        except Exception as e:
            logger.error("Cache exists error", key=key, exc_info=e)
            return False
    
    async def increment(self, key: str, amount: int = 1) -> Optional[int]:
        """Increment a numeric value in cache."""
        if not self.redis_client:
            return None
        
        try:
            return await self.redis_client.incrby(key, amount)
        except Exception as e:
            logger.error("Cache increment error", key=key, exc_info=e)
            return None
    
    async def expire(self, key: str, ttl: int) -> bool:
        """Set expiration for a key."""
        if not self.redis_client:
            return False
        
        try:
            return await self.redis_client.expire(key, ttl)
        except Exception as e:
            logger.error("Cache expire error", key=key, exc_info=e)
            return False
    
    async def get_keys(self, pattern: str = "*") -> list:
        """Get keys matching a pattern."""
        if not self.redis_client:
            return []
        
        try:
            keys = await self.redis_client.keys(pattern)
            return [key.decode('utf-8') if isinstance(key, bytes) else key for key in keys]
        except Exception as e:
            logger.error("Cache get_keys error", pattern=pattern, exc_info=e)
            return []

# Global cache manager instance
cache = CacheManager()

async def init_cache():
    """Initialize cache connection."""
    await cache.init()

async def close_cache():
    """Close cache connection."""
    await cache.close()

# Cache key generators
def analysis_cache_key(session_id: str, file_hash: str) -> str:
    """Generate cache key for analysis results."""
    return f"analysis:{session_id}:{file_hash}"

def model_cache_key(model_name: str, version: str) -> str:
    """Generate cache key for model artifacts."""
    return f"model:{model_name}:{version}"

def session_cache_key(session_id: str) -> str:
    """Generate cache key for session data."""
    return f"session:{session_id}"

def rate_limit_key(client_ip: str) -> str:
    """Generate cache key for rate limiting."""
    return f"rate_limit:{client_ip}"
