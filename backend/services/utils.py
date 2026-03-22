import time
from functools import wraps
from loguru import logger
from google.genai import errors as genai_errors

MODEL_FALLBACK_LIST = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash'
]

def retry_gemini_with_fallback(max_retries=2, delay=1.5):
    """
    Enhanced decorator with SHORT backoff AND model fallback.
    OPTIMIZED: Reduced delays and retry count to prevent timeout (60s limit).
    If quota is exhausted on one model, tries the next in the fallback list.
    Uses the new google.genai SDK.
    """
    def decorator(func):
        @wraps(func)
        def wrapper(self, *args, **kwargs):
            last_exception = None
            
            # Try each model in the fallback list
            for model_name in MODEL_FALLBACK_LIST:
                # Update the model if the class uses it
                if hasattr(self, 'model'):
                    self.model = model_name
                    logger.info(f"🔄 Attempting with model: {model_name}")
                
                # Retry logic for current model (max 2 tries, short delays)
                retries = 0
                while retries < max_retries:
                    try:
                        result = func(self, *args, **kwargs)
                        logger.info(f"[SUCCESS] Success with model: {model_name}")
                        return result
                    except (genai_errors.APIError, TimeoutError) as e:
                        retries += 1
                        last_exception = e
                        if retries == max_retries:
                            logger.warning(f"Model {model_name} failed after {max_retries} attempts: {str(e)[:100]}")
                            break  # Try next model
                        
                        # SHORT delay (1.5s, not exponential) to prevent 60s timeout
                        wait_time = delay
                        logger.warning(f"API error on {model_name} (attempt {retries}). Waiting {wait_time}s...")
                        time.sleep(wait_time)
                    except Exception as e:
                        logger.error(f"Unexpected error with model {model_name}: {str(e)[:100]}")
                        last_exception = e
                        break  # Try next model
            
            # All models failed
            error_msg = f"All models failed. Last: {str(last_exception)[:100] if last_exception else 'Unknown'}"
            logger.error(f"[CRITICAL] {error_msg}")
            raise last_exception if last_exception else Exception("All AI models failed")
        
        return wrapper
    return decorator

def retry_gemini(max_retries=3, delay=5):
    """
    Legacy decorator for backward compatibility.
    Now uses the enhanced version with fallback.
    """
    return retry_gemini_with_fallback(max_retries=max_retries, delay=delay)
