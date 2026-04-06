import pickle
import torch
import numpy as np
from PIL import Image
from io import BytesIO
import base64
import albumentations as A
from albumentations.pytorch import ToTensorV2
from rest_framework.decorators import api_view
from rest_framework.response import Response
import os
import torch.nn.functional as F

device = torch.device("cpu")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "best_model.pkl")

original_torch_load = torch.load

def cpu_load(*args, **kwargs):
    kwargs["map_location"] = device
    return original_torch_load(*args, **kwargs)

torch.load = cpu_load

with open(model_path, "rb") as f:
    model = pickle.load(f)

model = model.to(device)
model.eval()

print("Model loaded successfully")

transform = A.Compose([
    A.Resize(512, 512),
    A.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    ),
    ToTensorV2()
])

COLOR_MAP = {
    0: (34, 139, 34),
    1: (0, 255, 0),
    2: (255, 255, 0),
    3: (255, 165, 0),
    4: (128, 0, 128),
    5: (255, 20, 147),
    6: (139, 69, 19),
    7: (128, 128, 128),
    8: (210, 180, 140),
    9: (135, 206, 235),
}

def prediction_to_color(pred):
    h, w = pred.shape
    color = np.zeros((h, w, 3), dtype=np.uint8)
    for cls, c in COLOR_MAP.items():
        color[pred == cls] = c
    return color

@api_view(["POST"])
def predict_view(request):
    if "file" not in request.FILES:
        return Response({"error": "No file provided"}, status=400)

    try:
        file = request.FILES["file"]
        image = Image.open(file).convert("RGB")
        img_np = np.array(image)

        orig_h, orig_w = img_np.shape[:2]

        transformed = transform(image=img_np)
        img_tensor = transformed["image"].unsqueeze(0).to(device)

        with torch.no_grad():
            output = model(img_tensor)
            output = F.interpolate(
                output,
                size=(orig_h, orig_w),
                mode="bilinear",
                align_corners=False
            )
            pred = output.argmax(dim=1).squeeze().cpu().numpy()

        pred_color = prediction_to_color(pred)

        buffer = BytesIO()
        Image.fromarray(pred_color).save(buffer, format="PNG")
        img_str = base64.b64encode(buffer.getvalue()).decode()

        return Response({"image": img_str})

    except Exception as e:
        return Response({"error": str(e)}, status=500)