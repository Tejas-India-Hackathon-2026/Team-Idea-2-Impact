# LocalKart File Upload Storage Router
import os
import uuid
import time
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, status

router = APIRouter(prefix="/api", tags=["File Storage & Uploads"])

UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "uploads"))
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
ALLOWED_VIDEO_EXTS = {".mp4", ".webm", ".mov", ".m4v"}
ALLOWED_DOC_EXTS = {".pdf", ".jpg", ".jpeg", ".png"}

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB Max limit

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    category: str = Form("general") # product_images, product_videos, seller_docs, profile, chat
):
    """
    Validates and stores uploaded files (photos, videos, seller verification documents) securely.
    Returns hosted URL for persistent storage and application rendering.
    """
    ext = os.path.splitext(file.filename)[1].lower()
    
    all_allowed = ALLOWED_IMAGE_EXTS | ALLOWED_VIDEO_EXTS | ALLOWED_DOC_EXTS
    if ext not in all_allowed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{ext}'. Allowed types: images (jpg, png, webp), videos (mp4, webm), docs (pdf)."
        )

    # Read content to verify file size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds maximum limit of 50 MB."
        )

    # Create category directory
    target_dir = os.path.join(UPLOAD_DIR, category)
    os.makedirs(target_dir, exist_ok=True)

    # Generate unique filename
    unique_filename = f"{uuid.uuid4().hex}_{int(time.time())}{ext}"
    target_path = os.path.join(target_dir, unique_filename)

    with open(target_path, "wb") as f:
        f.write(contents)

    file_url = f"/uploads/{category}/{unique_filename}"

    return {
        "status": "success",
        "message": "File uploaded successfully!",
        "filename": file.filename,
        "saved_as": unique_filename,
        "url": file_url,
        "size_bytes": len(contents),
        "media_type": "video" if ext in ALLOWED_VIDEO_EXTS else ("image" if ext in ALLOWED_IMAGE_EXTS else "document")
    }
