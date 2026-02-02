import torch
from sentence_transformers import SentenceTransformer
from typing import List, Union
from loguru import logger
import numpy as np

class EmbeddingService:
    _instance = None
    _model = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmbeddingService, cls).__new__(cls)
            cls._initialize_model()
        return cls._instance

    @classmethod
    def _initialize_model(cls):
        """Initializes the Hugging Face model as a singleton."""
        try:
            model_name = "all-MiniLM-L6-v2"
            logger.info(f"Loading Hugging Face model: {model_name}...")
            # Use CPU by default for stability in most environments, but check for CUDA
            device = "cuda" if torch.cuda.is_available() else "cpu"
            cls._model = SentenceTransformer(model_name, device=device)
            logger.info(f"Model loaded successfully on {device}.")
        except Exception as e:
            logger.error(f"Failed to load embedding model: {e}")
            raise RuntimeError(f"Could not load Hugging Face model: {e}")

    def get_embedding(self, text: str) -> List[float]:
        """Generates a single embedding for the given text."""
        try:
            if not text or not isinstance(text, str):
                logger.warning("Empty or invalid text provided for embedding.")
                return []
            
            embedding = self._model.encode(text)
            return embedding.tolist()
        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            return []

    def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generates multiple embeddings for a list of strings."""
        try:
            if not texts:
                return []
            
            embeddings = self._model.encode(texts)
            return embeddings.tolist()
        except Exception as e:
            logger.error(f"Error generating batch embeddings: {e}")
            return []

# Usage:
# embedding_service = EmbeddingService()
# vector = embedding_service.get_embedding("React Developer with 5 years experience")
