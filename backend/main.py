from __future__ import annotations

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.requests import Request
from starlette.status import HTTP_400_BAD_REQUEST
from starlette.exceptions import HTTPException as StarletteHTTPException

import torch
import numpy as np
from PIL import Image
import io
import base64
import albumentations as A
import segmentation_models_pytorch as smp

# ================= CONFIG =================
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
NUM_CLASSES = 10

class_names = [
    "Trees", "Lush_Bushes", "Dry_Grass", "Dry_Bushes",
    "Ground_Clutter", "Flowers", "Logs", "Rocks",
    "Landscape", "Sky"
]

# ================= LOAD MODEL =================
model = smp.DeepLabV3Plus(
    encoder_name="resnet50",   # SAME as training
    encoder_weights=None,
    in_channels=3,
    classes=NUM_CLASSES,
)

model.load_state_dict(
    torch.load("best_model_small.pth", map_location=DEVICE)
)

# If you saved in FP16
model = model.half()

model.to(DEVICE)
model.eval()

print(f" Model loaded on {DEVICE}")

# ================= TRANSFORM =================
transform = A.Compose([
    A.Resize(512, 512),
    A.Normalize(
        mean=(0.485, 0.456, 0.406),
        std=(0.229, 0.224, 0.225)
    ),
])

# ================= COLOR MAP =================
def colorize(mask):
    colors = np.array([
        [0, 0, 0],
        [0, 255, 0],
        [255, 0, 0],
        [255, 255, 0],
        [0, 255, 255],
        [255, 0, 255],
        [128, 128, 0],
        [0, 128, 128],
        [128, 0, 128],
        [255, 255, 255],
    ])
    return colors[mask]

# ================= FASTAPI =================
app = FastAPI(title="Segmentation API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= ERROR HANDLING =================
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"status": "ERROR", "message": exc.detail},
    )

@app.exception_handler(Exception)
async def unhandled_exception_handler(_: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"status": "ERROR", "message": str(exc)},
    )

# ================= ROUTES =================
@app.get("/")
async def root():
    return {"status": "Backend running"}

@app.get("/health")
async def health():
    return {"status": "OK"}

# ================= PREDICT =================
@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    if not file.content_type.startswith("image/"):
        return JSONResponse(
            status_code=HTTP_400_BAD_REQUEST,
            content={"status": "ERROR", "message": "Upload an image file"},
        )

    contents = await file.read()

    image = Image.open(io.BytesIO(contents)).convert("RGB")
    img_np = np.array(image)

    aug = transform(image=img_np)
    img = aug["image"]

    img = torch.tensor(img).permute(2, 0, 1).unsqueeze(0)

    # FP16 compatibility
    if next(model.parameters()).dtype == torch.float16:
        img = img.half()
    else:
        img = img.float()

    img = img.to(DEVICE)

    # Predict
    with torch.no_grad():
        output = model(img)
        pred = torch.argmax(output, dim=1)

    pred_np = pred[0].cpu().numpy()

    # Colorize
    colored = colorize(pred_np)
    result_img = Image.fromarray(colored.astype(np.uint8))

    # Convert to base64
    buffered = io.BytesIO()
    result_img.save(buffered, format="PNG")
    img_base64 = base64.b64encode(buffered.getvalue()).decode()

    return {
        "status": "SUCCESS",
        "prediction": img_base64,
        "classes": class_names
    }