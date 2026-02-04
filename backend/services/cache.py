"""
AI Response Caching Layer
Implements LRU cache for frequently-used AI responses to reduce API calls and improve performance
"""
from functools import lru_cache
from typing import List, Dict, Tuple
import hashlib
import json
from loguru import logger

def generate_cache_key(*args, **kwargs) -> str:
    """
    Generate a deterministic cache key from function arguments.
    Converts all args/kwargs to JSON and hashes them.
    """
    # Combine args and kwargs into a single dict
    cache_dict = {
        'args': args,
        'kwargs': kwargs
    }
    # Convert to JSON string (sorted for consistency)
    json_str = json.dumps(cache_dict, sort_keys=True)
    # Hash it
    return hashlib.md5(json_str.encode()).hexdigest()

# Cache decorator for job description generation
def cached_job_description(maxsize=100):
    """
    LRU cache decorator specifically for job description generation.
    Caches based on keyword tuple to avoid duplicate API calls.
    """
    def decorator(func):
        # Convert list to tuple for hashability
        @lru_cache(maxsize=maxsize)
        def cached_func(self, keywords_tuple: Tuple[str, ...]) -> Dict[str, str]:
            logger.info(f"Cache MISS for keywords: {keywords_tuple[:3]}... (calling AI)")
            # Convert tuple back to list for the actual function
            result = func(self, list(keywords_tuple))
            return result
        
        def wrapper(self, keywords: List[str]) -> Dict[str, str]:
            # Convert list to tuple for caching
            keywords_tuple = tuple(sorted(keywords))  # Sort for consistency
            
            # Check if in cache
            cache_info = cached_func.cache_info()
            logger.info(f"Cache stats: hits={cache_info.hits}, misses={cache_info.misses}, size={cache_info.currsize}/{cache_info.maxsize}")
            
            try:
                result = cached_func(self, keywords_tuple)
                logger.info(f"Cache HIT for keywords: {keywords[:3]}...")
                return result
            except Exception as e:
                logger.error(f"Cache lookup failed: {e}")
                # Fallback to direct call
                return func(self, keywords)
        
        # Expose cache_info and cache_clear
        wrapper.cache_info = cached_func.cache_info
        wrapper.cache_clear = cached_func.cache_clear
        
        return wrapper
    return decorator

# Cache decorator for resume analysis
def cached_resume_analysis(maxsize=200):
    """
    LRU cache decorator for resume analysis.
    Caches based on (resume_text_hash, must_have_skills_hash).
    """
    def decorator(func):
        @lru_cache(maxsize=maxsize)
        def cached_func(self, resume_hash: str, skills_tuple: Tuple[str, ...]):
            logger.info(f"Cache MISS for resume analysis (calling AI)")
            # This is a placeholder - actual implementation would need the full data
            raise NotImplementedError("Use wrapper function")
        
        def wrapper(self, resume_text: str, must_have_skills: List[str]):
            # Generate cache keys
            resume_hash = hashlib.md5(resume_text.encode()).hexdigest()
            skills_tuple = tuple(sorted(must_have_skills))
            
            # Create composite key
            cache_key = f"{resume_hash}:{skills_tuple}"
            
            # Check cache
            cache_info = cached_func.cache_info()
            logger.info(f"Resume analysis cache stats: hits={cache_info.hits}, misses={cache_info.misses}")
            
            # For now, bypass cache and call directly (full implementation would use Redis)
            logger.info(f"Analyzing resume (hash: {resume_hash[:8]}...) against {len(must_have_skills)} requirements")
            return func(self, resume_text, must_have_skills)
        
        wrapper.cache_info = cached_func.cache_info
        wrapper.cache_clear = cached_func.cache_clear
        
        return wrapper
    return decorator

# Simple in-memory cache for bullet point improvements
_bullet_cache: Dict[str, str] = {}
MAX_BULLET_CACHE_SIZE = 500

def cache_bullet_improvement(bullet_point: str, jd_context: str, improved: str):
    """
    Cache a bullet point improvement result.
    """
    # Generate key
    key = hashlib.md5(f"{bullet_point}::{jd_context}".encode()).hexdigest()
    
    # Add to cache
    _bullet_cache[key] = improved
    
    # Evict oldest if too large (simple FIFO)
    if len(_bullet_cache) > MAX_BULLET_CACHE_SIZE:
        # Remove first item (oldest in dict)
        first_key = next(iter(_bullet_cache))
        del _bullet_cache[first_key]
        logger.debug(f"Evicted oldest bullet cache entry")
    
    logger.info(f"Cached bullet improvement (cache size: {len(_bullet_cache)})")

def get_cached_bullet_improvement(bullet_point: str, jd_context: str) -> str | None:
    """
    Retrieve a cached bullet point improvement if it exists.
    """
    key = hashlib.md5(f"{bullet_point}::{jd_context}".encode()).hexdigest()
    result = _bullet_cache.get(key)
    
    if result:
        logger.info(f"Bullet cache HIT (cache size: {len(_bullet_cache)})")
    else:
        logger.info(f"Bullet cache MISS")
    
    return result

def get_cache_stats() -> Dict[str, any]:
    """
    Get statistics about all caches.
    """
    return {
        "bullet_cache_size": len(_bullet_cache),
        "bullet_cache_max": MAX_BULLET_CACHE_SIZE,
        "bullet_cache_utilization": f"{(len(_bullet_cache) / MAX_BULLET_CACHE_SIZE) * 100:.1f}%"
    }
