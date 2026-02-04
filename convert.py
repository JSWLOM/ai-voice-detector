import base64

with open("sample.mp3", "rb") as f:
    encoded = base64.b64encode(f.read()).decode("utf-8")

with open("base64.txt", "w") as f:
    f.write(encoded)

print("Base64 written to base64.txt")
