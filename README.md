# 🎙️ AI-Generated Voice Detection API (Multi-Language)

A REST API that detects whether a voice sample is **AI-generated** or **Human**, supporting multiple languages including **Tamil, English, Hindi, Malayalam, and Telugu**.

---

## 🚀 Overview

With the rise of AI-generated voices and deepfake audio, distinguishing between real and synthetic speech has become increasingly important.  
This project provides a **production-ready API** that analyzes audio characteristics and classifies speech as either human or AI-generated.

---

## ✨ Features

- 🎧 Accepts **Base64-encoded MP3 audio**
- 🌐 Supports **5 languages**:
  - Tamil
  - English
  - Hindi
  - Malayalam
  - Telugu
- 🔐 Secured using **API Key authentication**
- ⚡ Fast and lightweight **FastAPI backend**
- 🧠 Explainable decision logic (no black-box model)
- ☁️ Deployed on **Render**

---

## 🛠️ Tech Stack

- **Python**
- **FastAPI**
- **PyDub + FFmpeg**
- **Librosa**
- **NumPy & SciPy**
- **Requests**
- **Render (Deployment)**
- **GitHub**

---

## 🔍 How It Works

The system analyzes acoustic features of speech:

- **Pitch Stability** → AI voices tend to have overly consistent pitch  
- **Energy Variation** → Human speech has natural loudness fluctuations  
- **Zero Crossing Rate (ZCR)** → Measures signal smoothness  
- **Spectral Centroid Variation** → Captures frequency distribution changes  

Based on these features, a rule-based system classifies the voice as:

- `AI_GENERATED`
- `HUMAN`

---

## 🔐 API Authentication
All requests must include an API key in headers:
x-api-key: sk_test_123456789


## 🌐 Live API Endpoint
POST https://ai-voice-detector-qgjt.onrender.com/api/voice-detection
## 📥 Request Format

### 🔹 Option 1: Base64 Audio

json
{
  "language": "Tamil",
  "audioFormat": "mp3",
  "audioBase64": "<BASE64_ENCODED_MP3>"
}

### 🔹 Option 1:  Audio URL
{
  "language": "English",
  "audioFormat": "mp3",
  "audioUrl": "https://example.com/sample.mp3"
}

### Response format
{
  "status": "success",
  "language": "Tamil",
  "classification": "HUMAN",
  "confidenceScore": 0.85,
  "explanation": "Natural variations in pitch, energy, and articulation patterns detected"
}

### Error response
{
  "status": "error",
  "message": "Invalid API key or malformed request"
}

### Sample cURL Request
curl -X POST https://ai-voice-detector-qgjt.onrender.com/api/voice-detection \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk_test_123456789" \
  -d '{
    "language": "English",
    "audioFormat": "mp3",
    "audioUrl": "https://drive.google.com/uc?export=download&id=1n2RsLy-jfY025IbbaRQMex-KVgePG3zV"
  }'


  ### Project structure
  ├── main.py           # FastAPI app
├── features.py       # Feature extraction logic
├── requirements.txt  # Dependencies
├── convert.py        # MP3 → Base64 utility
└── README.md         # Project documentation

All requests must include an API key in headers:
