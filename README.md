# 🏜️ Enfinity: Desert Environment Semantic Segmentation

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat\&logo=fastapi\&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js-000000?style=flat\&logo=nextdotjs\&logoColor=white)](https://nextjs.org/)
[![PyTorch](https://img.shields.io/badge/ML-PyTorch-EE4C2C?style=flat\&logo=pytorch\&logoColor=white)](https://pytorch.org/)

A high-performance full-stack application for **real-time desert landscape analysis**.
This project uses **DeepLabV3+** to perform **pixel-level semantic segmentation** across 10 environmental classes, while addressing class imbalance using **class-weighted loss functions**.

---

## 🏗️ Architecture Overview

The system is modular and scalable, consisting of three layers:

### 🧠 Deep Learning Pipeline

* Model: **DeepLabV3+**
* Backbone: ResNet / Xception
* Handles:

  * Training
  * Validation
  * mIoU evaluation

### ⚙️ Backend (API)

* Framework: **FastAPI**
* Responsibilities:

  * Image preprocessing
  * Model inference
  * Post-processing segmentation masks

### 💻 Frontend (UI)

* Framework: **Next.js + Tailwind CSS**
* Features:

  * Drag-and-drop image upload
  * Real-time segmentation results
  * Side-by-side comparison (input vs output)

---

## 📁 Project Structure

```text
.
├── backend/                  # FastAPI + PyTorch Inference
│   ├── main.py               # API Endpoints
│   ├── model/                # DeepLabV3+ Model Definition
│   ├── weights/              # Trained .pth weights
│   └── requirements.txt      # Python dependencies
│
└── frontend/                 # Next.js + Tailwind CSS
    ├── src/app               # Pages
    ├── src/components        # Upload & Results Components
    └── public/               # Static Assets
```
---

## 🧠 Model Class Mapping

| Index | Class Name     | Description                  |
| ----- | -------------- | ---------------------------- |
| 0     | Trees          | Primary vegetation           |
| 1     | Lush Bushes    | Dense green shrubs           |
| 2     | Dry Grass      | Arid ground cover            |
| 3     | Dry Bushes     | Arid woody shrubs            |
| 4     | Ground Clutter | Debris and scattered objects |
| 5     | Flowers        | Rare small vegetation        |
| 6     | Logs           | Fallen wood/timber           |
| 7     | Rocks          | Geological formations        |
| 8     | Landscape      | General terrain/sand         |
| 9     | Sky            | Atmospheric background       |

---

## 🚀 Installation & Setup

### 🔹 Backend (Django)

```bash
cd backend-2
pip install -r requirements.txt
cd server
python manage.py runserver
```

---

### 🔹 Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

---

## 📊 Evaluation & Performance

We use **Mean Intersection over Union (mIoU)** as the primary evaluation metric.

### 🎯 Key Optimization: Class Imbalance Handling

To improve performance on rare but critical classes, we implemented:

**Class-Weighted Cross-Entropy Loss**

* Rare Classes (Flowers, Logs) → **Weight = 3.0**
* Frequent Classes (Sky, Landscape) → **Weight = 0.5**

### 💡 Impact:

* Better detection of small objects
* Improved segmentation accuracy in edge cases
* Higher overall mIoU score

---

## 📸 Features

* ⚡ Real-time inference via API
* 🧠 High-accuracy segmentation with DeepLabV3+
* 📊 mIoU-based performance tracking
* 🖼️ Side-by-side visualization of results
* 🧩 Modular full-stack architecture

---

## 🔮 Future Improvements

* Domain adaptation for unseen environments
* Real-time video segmentation
* Model quantization for faster inference
* Multi-view segmentation support

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 📌 Hackathon Focus

* Maximizing **IoU / mIoU score**
* Robust performance on **unseen desert environments**
* Clean and reproducible pipeline
* Strong visualization and reporting

---

## 🏆 Team normies

Built with during a 24-hour hackathon to push the limits of real-time semantic segmentation.
