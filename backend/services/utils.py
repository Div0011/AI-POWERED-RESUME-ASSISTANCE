import time
from functools import wraps
from loguru import logger
import google.api_core.exceptions

def retry_gemini(max_retries=3, delay=5):
    """
    Decorator to retry Gemini API calls on quota or transient errors.
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            retries = 0
            while retries < max_retries:
                try:
                    return func(*args, **kwargs)
                except (google.api_core.exceptions.ResourceExhausted, 
                        google.api_core.exceptions.ServiceUnavailable,
                        google.api_core.exceptions.InternalServerError) as e:
                    retries += 1
                    if retries == max_retries:
                        logger.error(f"Gemini API failed after {max_retries} attempts: {e}")
                        raise e
                    wait_time = delay * retries
                    logger.warning(f"Gemini Quota/Error (Attempt {retries}): {e}. Retrying in {wait_time}s...")
                    time.sleep(wait_time)
                except Exception as e:
                    logger.error(f"Unexpected error in Gemini call: {e}")
                    raise e
            return None
        return wrapper
    return decorator
