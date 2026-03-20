# 🎙️ AI Voice Detector (Multi-Language)

A full-stack AI-powered system that detects whether a voice sample is **AI-generated** or **human speech** using audio signal analysis.

---

## 🌐 Live Demo

🔗 Frontend: https://ai-voice-detector-seven.vercel.app/
🔗 Backend API: https://ai-voice-detector-qgjt.onrender.com

---

## 🚀 Features

* 🎧 Upload MP3 audio files
* 🌍 Supports multiple languages:

  * English
  * Hindi
  * Tamil
  * Malayalam
  * Telugu
* 🧠 Detects AI vs Human speech
* 📊 Returns:

  * Classification (AI / HUMAN)
  * Confidence Score
  * Explanation
* ⚡ Real-time API processing
* 🌐 Fully deployed (Frontend + Backend)

---

## 🏗️ Tech Stack

### Frontend

* React.js
* Fetch API
* Vercel (Deployment)

### Backend

* FastAPI
* Python
* Pydub (Audio Processing)
* FFmpeg (Audio decoding)
* Render (Deployment)

---

## ⚙️ API Endpoint

### POST `/api/voice-detection`

#### Headers:

```
x-api-key: sk_test_123456789
Content-Type: application/json
```

#### Request Body:

```json
{
  "language": "English",
  "audioFormat": "mp3",
  "audioBase64": "BASE64_AUDIO_STRING"
}
```

#### OR (using URL):

```json
{
  "language": "English",
  "audioFormat": "mp3",
  "audioUrl": "https://example.com/audio.mp3"
}
```

---

## 📥 Response Format

```json
{
  "status": "success",
  "language": "English",
  "classification": "HUMAN",
  "confidenceScore": 0.85,
  "explanation": "Natural variations in pitch, energy, and articulation patterns detected"
}
```

---

## 🧠 How It Works (Core Logic)

The system does **signal-based audio analysis** to distinguish between AI-generated and human voices.

### 🔍 Step-by-step Pipeline:

1. **Input Handling**

   * Accepts audio as Base64 or URL
   * Validates format (MP3 only)

2. **Audio Conversion**

   * Converts MP3 → WAV using FFmpeg
   * Ensures consistent processing format

3. **Feature Extraction**
   Extracts key audio features:

   * 🎚️ Pitch (frequency variation)
   * 🔊 Energy (loudness variation)
   * 🔁 Zero Crossing Rate (signal smoothness)
   * 🌈 Spectral Centroid (frequency distribution)

4. **Decision Logic (Rule-Based AI)**
   The system compares extracted features:

   | Feature           | AI Voice Pattern | Human Voice Pattern  |
   | ----------------- | ---------------- | -------------------- |
   | Pitch Variation   | Very stable      | Fluctuates naturally |
   | Energy            | Uniform          | Dynamic              |
   | ZCR               | Smooth           | Irregular            |
   | Spectral Features | Consistent       | Variable             |

5. **Scoring System**

   * Each feature votes: AI or Human
   * Final classification based on majority

6. **Confidence Score**

   * Based on how many features agree

---

## 🧪 Example Use Case

* Detect AI-generated deepfake audio
* Voice authentication systems
* Fraud/scam detection systems
* Content verification tools

---

## ⚠️ Limitations

* Rule-based (not deep learning yet)
* Accuracy depends on audio quality
* Advanced AI voices may bypass detection

---

## 🔮 Future Improvements

* 🤖 Train ML/DL model (CNN / LSTM)
* 🎯 Improve accuracy with dataset training
* 📱 Mobile app integration
* 🔊 Support more audio formats (WAV, FLAC)
* 🧠 Real-time streaming detection

---

## 🛠️ Setup Locally

```bash
git clone https://github.com/your-username/ai-voice-detector.git
cd ai-voice-detector
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## 👨‍💻 Author

Developed as part of a Hackathon Project 🚀
Built with ❤️ using FastAPI + React

---

## ⭐ If you like this project

Give it a ⭐ on GitHub and share it!

