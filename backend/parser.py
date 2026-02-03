from loguru import logger
import os

def parse_resume(file_path: str) -> str:
    """
    Parses a resume PDF/DOCX using Docling and returns the text content.
    Has fallback for TXT files.
    """
    try:
        # Fast path for TXT
        if file_path.lower().endswith(".txt"):
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()

        # Try Docling for PDF/DOCX
        from docling.document_converter import DocumentConverter
        converter = DocumentConverter()
        result = converter.convert(file_path)
        return result.document.export_to_markdown()
    except ImportError:
        logger.warning("Docling not installed. Returning raw text read if possible.")
        # Fallback reading
        try:
             with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()
        except:
             return "Error: Could not parse file and Docling is missing."
    except Exception as e:
        logger.error(f"Docling parsing failed: {e}")
        return f"Error parsing file: {str(e)}"

if __name__ == "__main__":
    pass
