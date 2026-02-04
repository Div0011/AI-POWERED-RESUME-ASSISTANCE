from loguru import logger
import os

def parse_resume(file_path: str) -> str:
    """
    Parses a resume PDF/DOCX using multiple fallback strategies.
    Priority: Docling → PyPDF2 → pdfplumber → Raw text
    """
    try:
        # Fast path for TXT
        if file_path.lower().endswith(".txt"):
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
                logger.info(f"Parsed TXT file: {len(content)} characters")
                return content

        # Strategy 1: Try Docling (best quality)
        try:
            from docling.document_converter import DocumentConverter
            converter = DocumentConverter()
            result = converter.convert(file_path)
            content = result.document.export_to_markdown()
            logger.info(f"Docling parsing successful: {len(content)} characters")
            return content
        except ImportError:
            logger.warning("Docling not installed, trying fallback parsers...")
        except Exception as e:
            logger.warning(f"Docling failed: {e}, trying fallback parsers...")

        # Strategy 2: Try PyPDF2 (most common)
        if file_path.lower().endswith(".pdf"):
            try:
                import PyPDF2
                with open(file_path, "rb") as f:
                    reader = PyPDF2.PdfReader(f)
                    text = ""
                    for page in reader.pages:
                        text += page.extract_text() + "\n"
                    
                    if text.strip():
                        logger.info(f"PyPDF2 parsing successful: {len(text)} characters")
                        return text
                    else:
                        logger.warning("PyPDF2 extracted empty text, trying next method...")
            except ImportError:
                logger.warning("PyPDF2 not installed, trying next method...")
            except Exception as e:
                logger.warning(f"PyPDF2 failed: {e}, trying next method...")

        # Strategy 3: Try pdfplumber (better for complex PDFs)
        if file_path.lower().endswith(".pdf"):
            try:
                import pdfplumber
                text = ""
                with pdfplumber.open(file_path) as pdf:
                    for page in pdf.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n"
                
                if text.strip():
                    logger.info(f"pdfplumber parsing successful: {len(text)} characters")
                    return text
                else:
                    logger.warning("pdfplumber extracted empty text")
            except ImportError:
                logger.warning("pdfplumber not installed")
            except Exception as e:
                logger.warning(f"pdfplumber failed: {e}")

        # Strategy 4: Try python-docx for DOCX files
        if file_path.lower().endswith(".docx"):
            try:
                from docx import Document
                doc = Document(file_path)
                text = "\n".join([para.text for para in doc.paragraphs])
                if text.strip():
                    logger.info(f"python-docx parsing successful: {len(text)} characters")
                    return text
            except ImportError:
                logger.warning("python-docx not installed")
            except Exception as e:
                logger.warning(f"python-docx failed: {e}")

        # All strategies failed
        logger.error("All parsing strategies failed")
        return "Error: Could not extract text from file. Please ensure the PDF is not password-protected or corrupted. You can also paste your resume text manually."

    except Exception as e:
        logger.error(f"Unexpected error in parse_resume: {e}")
        return f"Error parsing file: {str(e)}. Please try pasting your resume text manually."

if __name__ == "__main__":
    # Test with a sample file
    import sys
    if len(sys.argv) > 1:
        result = parse_resume(sys.argv[1])
        print(result)
