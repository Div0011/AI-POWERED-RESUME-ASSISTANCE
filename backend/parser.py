from docling.document_converter import DocumentConverter
import os

def parse_resume(file_path: str) -> str:
    """
    Parses a resume PDF/DOCX using Docling and returns the text content.
    """
    converter = DocumentConverter()
    result = converter.convert(file_path)
    return result.document.export_to_markdown()

if __name__ == "__main__":
    # Example usage
    # print(parse_resume("path/to/resume.pdf"))
    pass
