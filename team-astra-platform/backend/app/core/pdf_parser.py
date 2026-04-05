import pdfplumber
import io

async def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """
    Takes raw file bytes from the frontend upload and uses pdfplumber 
    to extract all readable text from the document.
    """
    text = ""
    try:
        # We load the bytes into a temporary in-memory file
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        return text.strip()
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""