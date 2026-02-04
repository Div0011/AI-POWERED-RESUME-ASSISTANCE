import time
from functools import wraps
from loguru import logger
import google.api_core.exceptions

# Model fallback list for quota resilience (updated for google-genai SDK)
MODEL_FALLBACK_LIST = [
    'gemini-2.0-flash-exp',
    'gemini-1.5-flash-002',  # Updated model name
    'gemini-1.5-flash-8b',
    'gemini-1.5-pro-002'     # Updated model name
]

def retry_gemini_with_fallback(max_retries=3, delay=5):
    """
    Enhanced decorator with exponential backoff AND model fallback.
    If quota is exhausted on one model, tries the next in the fallback list.
    Uses the new google.genai SDK.
    """
    def decorator(func):
        @wraps(func)
        def wrapper(self, *args, **kwargs):
            last_exception = None
            
            # Try each model in the fallback list
            for model_name in MODEL_FALLBACK_LIST:
                # Update the model using new SDK
                try:
                    from google import genai
                    from google.genai import types
                    
                    # Initialize client if not already done
                    if not hasattr(self, 'client'):
                        import os
                        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
                    
                    self.model_name = model_name
                    logger.info(f"🔄 Attempting with model: {model_name}")
                except ImportError as e:
                    logger.error(f"Failed to import google.genai: {e}")
                    # Fallback to old SDK if new one not available
                    try:
                        import google.generativeai as genai_old
                        self.model = genai_old.GenerativeModel(model_name)
                        logger.warning(f"Using legacy SDK for {model_name}")
                    except Exception as e2:
                        logger.error(f"Both SDKs failed: {e2}")
                        continue
                
                # Retry logic for current model
                retries = 0
                while retries < max_retries:
                    try:
                        result = func(self, *args, **kwargs)
                        logger.info(f"✅ Success with model: {model_name}")
                        return result
                    except (google.api_core.exceptions.ResourceExhausted, 
                            google.api_core.exceptions.ServiceUnavailable,
                            google.api_core.exceptions.InternalServerError) as e:
                        retries += 1
                        last_exception = e
                        if retries == max_retries:
                            logger.warning(f"Model {model_name} failed after {max_retries} attempts: {e}")
                            break  # Try next model
                        
                        # Exponential backoff
                        wait_time = delay * (2 ** (retries - 1))
                        logger.warning(f"Quota/Error on {model_name} (Attempt {retries}): {e}. Retrying in {wait_time}s...")
                        time.sleep(wait_time)
                    except Exception as e:
                        logger.error(f"Unexpected error with model {model_name}: {e}")
                        last_exception = e
                        break  # Try next model
            
            # All models failed
            logger.error(f"All models in fallback list exhausted. Last error: {last_exception}")
            raise last_exception if last_exception else Exception("All AI models failed")
        
        return wrapper
    return decorator

def retry_gemini(max_retries=3, delay=5):
    """
    Legacy decorator for backward compatibility.
    Now uses the enhanced version with fallback.
    """
    return retry_gemini_with_fallback(max_retries=max_retries, delay=delay)
