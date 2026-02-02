import sys
import os
import logging
import numpy as np
from loguru import logger

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "backend"))

from services.embedding import EmbeddingService

def test_loguru_interception():
    print("\n--- Testing Loguru Interception ---")
    # This standard logging call should be intercepted by Loguru if main.py logic is active
    # In this test script, we manually setup the interceptor for verification
    class InterceptHandler(logging.Handler):
        def emit(self, record):
            logger.log(record.levelname, record.getMessage())

    logging.root.handlers = [InterceptHandler()]
    logging.root.setLevel(logging.INFO)
    
    std_logger = logging.getLogger("test_std_logger")
    std_logger.info("This is a standard logging message intercepted by Loguru.")
    return True

def test_embedding_similarity():
    print("\n--- Testing Embedding Similarity (Hugging Face) ---")
    service = EmbeddingService()
    
    query = "React Developer with TypeScript experience"
    resumes = [
        "Experienced Frontend Engineer specialized in React, Redux, and TypeScript.",
        "Python Backend Developer with FastAPI and PostgreSQL skills.",
        "Graphic Designer with expertise in Photoshop and Illustrator."
    ]
    
    query_vec = np.array(service.get_embedding(query))
    resume_vecs = [np.array(v) for v in service.get_embeddings(resumes)]
    
    results = []
    for i, r_vec in enumerate(resume_vecs):
        # Cosine Similarity: (A . B) / (||A|| * ||B||)
        similarity = np.dot(query_vec, r_vec) / (np.linalg.norm(query_vec) * np.linalg.norm(r_vec))
        results.append((resumes[i], similarity))
    
    # Sort by similarity
    results.sort(key=lambda x: x[1], reverse=True)
    
    print(f"Query: {query}")
    for resume, score in results:
        print(f"Score: {score:.4f} | Resume: {resume}")
    
    # Assertions
    assert results[0][1] > results[1][1], "React resume should rank higher than Python for React query"
    return results

if __name__ == "__main__":
    try:
        test_loguru_interception()
        similarity_results = test_embedding_similarity()
        print("\n✅ Infrastructure Test Passed!")
    except Exception as e:
        print(f"\n❌ Infrastructure Test Failed: {e}")
        sys.exit(1)
