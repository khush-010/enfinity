from __future__ import annotations

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.requests import Request
from starlette.status import HTTP_400_BAD_REQUEST
from starlette.exceptions import HTTPException as StarletteHTTPException


app = FastAPI(title="Minimal Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    if exc.status_code == 404:
        return JSONResponse(
            status_code=HTTP_400_BAD_REQUEST,
            content={
                "status": "ERROR",
                "message": "Route not found",
                "path": str(request.url.path),
                "available_routes": ["/", "/health", "/predict"],
            },
        )
    return JSONResponse(status_code=exc.status_code, content={"status": "ERROR", "message": exc.detail})


@app.exception_handler(Exception)
async def unhandled_exception_handler(_: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(status_code=500, content={"status": "ERROR", "message": "Internal server error"})


@app.get("/")
async def root() -> dict:
    return {"status": "Backend running"}


@app.get("/health")
async def health() -> dict:
    return {"status": "OK"}


@app.post("/predict")
async def predict(
    file: UploadFile | None = File(None),
    image: UploadFile | None = File(None),
) -> dict:
    upload = file or image
    if upload is None:
        return JSONResponse(
            status_code=HTTP_400_BAD_REQUEST,
            content={"status": "ERROR", "message": "Missing image upload (use form field 'file' or 'image')"},
        )

    if not upload.content_type or not upload.content_type.startswith("image/"):
        return JSONResponse(
            status_code=HTTP_400_BAD_REQUEST,
            content={"status": "ERROR", "message": "Uploaded file must be an image"},
        )

    # Read the upload to ensure it's a valid multipart file upload; no ML logic is performed.
    await upload.read()

    return {
        "message": "Prediction successful",
        "classes": ["tree", "grass", "rock"],
        "confidence": [0.9, 0.8, 0.7],
    }
