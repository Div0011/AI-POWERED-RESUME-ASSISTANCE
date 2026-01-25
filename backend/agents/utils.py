import re

def detect_fake_claims(text: str) -> list:
    """
    Basic NLP heuristics to detect potential fake claims in a resume.
    This is a simplified version.
    """
    warnings = []
    
    # Check for inconsistent dates (e.g., 2022-2021)
    date_ranges = re.findall(r'(\d{4})\s*-\s*(\d{4})', text)
    for start, end in date_ranges:
        if int(start) > int(end):
            warnings.append(f"Inconsistent date range found: {start}-{end}")
            
    # Check for buzzword stuffing (too many high-level keywords without context)
    buzzwords = ["expert", "mastered", "professional", "world-class", "innovative"]
    count = sum(1 for word in buzzwords if word in text.lower())
    if count > 10:
        warnings.append("Potential buzzword stuffing detected.")
        
    # Check for generic descriptions
    if len(text) < 500:
        warnings.append("Resume content is unusually short.")
        
    return warnings
