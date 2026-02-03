import base64

with open("Sample.mp3", "rb") as audio_file:
    encoded = base64.b64encode(audio_file.read()).decode("utf-8")

print(encoded)
