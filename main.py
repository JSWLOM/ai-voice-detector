import base64
import os
import uuid
from typing import Optional

import requests
from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel
from pydub import AudioSegment

from features import extract_features

app = FastAPI(title="AI Voice Detection API")

# -------- Request Model --------
class VoiceRequest(BaseModel):
    language: str
    audioFormat: str
    audioBase64: Optional[str] = None
    audioUrl: Optional[str] = None


@app.post("/api/voice-detection")
def detect_voice(
    request: VoiceRequest,
    x_api_key: str = Header(None)
):
    # ---- API Key Validation ----
    if x_api_key != "sk_test_123456789":
        raise HTTPException(status_code=401, detail="Invalid API key")

    # ---- Audio Format Validation ----
    if request.audioFormat.lower() != "mp3":
        raise HTTPException(
            status_code=400,
            detail="Only MP3 audio format is supported"
        )

    # ---- Obtain Audio Bytes (Base64 OR URL) ----
    try:
        if request.audioBase64:
            audio_bytes = base64.b64decode(request.audioBase64)

        elif request.audioUrl:
            resp = requests.get(request.audioUrl, timeout=10)
            if resp.status_code != 200:
                raise Exception("Failed to download audio from URL")
            audio_bytes = resp.content

        else:
            raise Exception("No audio input provided")

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid audio input: {str(e)}"
        )

    # ---- Temporary File Paths ----
    file_id = str(uuid.uuid4())
    mp3_path = f"temp_{file_id}.mp3"
    wav_path = f"temp_{file_id}.wav"

    try:
        # ---- Save MP3 ----
        with open(mp3_path, "wb") as f:
            f.write(audio_bytes)

        # ---- Convert MP3 → WAV ----
        audio = AudioSegment.from_mp3(mp3_path)
        audio.export(wav_path, format="wav")

        # ---- Feature Extraction ----
        features = extract_features(wav_path)

        # ---- Multi-Feature Decision Logic ----
        ai_score = 0
        human_score = 0

        # 1. Pitch stability
        if features["pitch_std"] < 20:
            ai_score += 1
        else:
            human_score += 1

        # 2. Energy variation
        if features["energy_std"] < 0.01:
            ai_score += 1
        else:
            human_score += 1

        # 3. Zero-crossing smoothness
        if features["zcr_mean"] < 0.05:
            ai_score += 1
        else:
            human_score += 1

        # 4. Spectral consistency
        if features["centroid_std"] < 300:
            ai_score += 1
        else:
            human_score += 1

        # ---- Final Classification ----
        if ai_score >= 3:
            classification = "AI_GENERATED"
            confidence = round(ai_score / 4, 2)
            explanation = (
                "Highly consistent pitch, energy, and spectral patterns "
                "indicate synthetic speech characteristics"
            )
        else:
            classification = "HUMAN"
            confidence = round(human_score / 4, 2)
            explanation = (
                "Natural variations in pitch, energy, and articulation "
                "patterns detected"
            )

        response = {
            "status": "success",
            "language": request.language,
            "classification": classification,
            "confidenceScore": confidence,
            "explanation": explanation
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Audio processing failed: {str(e)}"
        )

    finally:
        # ---- Cleanup Temporary Files ----
        if os.path.exists(mp3_path):
            os.remove(mp3_path)
        if os.path.exists(wav_path):
            os.remove(wav_path)

    return response
