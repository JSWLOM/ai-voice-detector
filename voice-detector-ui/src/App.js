import React, { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async () => {
    if (!file) return alert("Upload a file first");

    const base64Audio = await convertToBase64(file);

    const response = await fetch(
      "https://ai-voice-detector-qgjt.onrender.com/api/voice-detection",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "sk_test_123456789",
        },
        body: JSON.stringify({
          language: "English",
          audioFormat: "mp3",
          audioBase64: base64Audio,
        }),
      }
    );

    const data = await response.json();
    setResult(data);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🎙️ AI Voice Detector</h1>

      <input type="file" accept="audio/mp3" onChange={handleFileChange} />
      <br /><br />

      <button onClick={handleSubmit}>Analyze</button>

      {result && (
        <div style={{ marginTop: "30px" }}>
          <h2>Result</h2>
          <p><strong>Classification:</strong> {result.classification}</p>
          <p><strong>Confidence:</strong> {result.confidenceScore}</p>
          <p><strong>Explanation:</strong> {result.explanation}</p>
        </div>
      )}
    </div>
  );
}

export default App;