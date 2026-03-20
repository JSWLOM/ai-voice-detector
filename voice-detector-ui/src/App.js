import { useState, useRef, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: #080B10; min-height: 100vh; font-family: 'Syne', sans-serif; }

  .app {
    min-height: 100vh;
    background: #080B10;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 2rem;
    position: relative;
    overflow: hidden;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .bg-orb { position: fixed; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0; }
  .bg-orb-1 { width: 500px; height: 500px; background: rgba(99,102,241,0.12); top: -100px; left: -150px; }
  .bg-orb-2 { width: 400px; height: 400px; background: rgba(20,184,166,0.08); bottom: -100px; right: -100px; }

  .main-col { position: relative; z-index: 1; width: 100%; max-width: 520px; margin-top: 2rem; }
  .history-col { position: relative; z-index: 1; width: 100%; max-width: 300px; margin-top: 2rem; }

  .card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 24px;
    padding: 2.5rem;
    backdrop-filter: blur(20px);
  }

  .header { margin-bottom: 2rem; }

  .badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3);
    border-radius: 100px; padding: 4px 12px;
    font-family: 'DM Mono', monospace; font-size: 11px; color: #a5b4fc;
    letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 1rem;
  }
  .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #818cf8; animation: pulse-dot 2s infinite; }
  @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }

  h1 { font-size: 2rem; font-weight: 800; color: #f1f5f9; line-height: 1.1; letter-spacing: -0.03em; }
  h1 span { color: #818cf8; }
  .subtitle { margin-top: 0.5rem; font-size: 14px; color: rgba(255,255,255,0.35); font-family: 'DM Mono', monospace; }

  .drop-zone {
    margin: 1.5rem 0;
    border: 1.5px dashed rgba(255,255,255,0.1);
    border-radius: 16px; padding: 2.5rem 1.5rem;
    text-align: center; cursor: pointer;
    transition: all 0.2s ease;
    background: rgba(255,255,255,0.02);
    position: relative; overflow: hidden;
  }
  .drop-zone:hover, .drop-zone.dragover { border-color: rgba(99,102,241,0.5); background: rgba(99,102,241,0.05); }
  .drop-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
  .drop-icon { width: 48px; height: 48px; margin: 0 auto 1rem; background: rgba(99,102,241,0.15); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; }
  .drop-label { font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.7); }
  .drop-sub { font-size: 12px; color: rgba(255,255,255,0.25); font-family: 'DM Mono', monospace; margin-top: 4px; }

  .waveform-wrap {
    margin: 0.75rem 0 1rem;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px; padding: 12px 14px;
    animation: slide-up 0.3s ease;
  }
  .waveform-label { font-size: 11px; font-family: 'DM Mono', monospace; color: rgba(255,255,255,0.25); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; }
  canvas.waveform { width: 100%; height: 56px; display: block; }

  .player-wrap {
    display: flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px; padding: 10px 14px;
    margin-bottom: 1.25rem; animation: slide-up 0.3s ease;
  }
  .play-btn {
    width: 34px; height: 34px; border-radius: 50%;
    background: rgba(99,102,241,0.2); border: 1px solid rgba(99,102,241,0.4);
    color: #a5b4fc; font-size: 13px; cursor: pointer; display: flex;
    align-items: center; justify-content: center; transition: all 0.15s; flex-shrink: 0;
  }
  .play-btn:hover { background: rgba(99,102,241,0.35); }
  .player-bar-wrap { flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .player-track { height: 3px; background: rgba(255,255,255,0.08); border-radius: 100px; cursor: pointer; position: relative; }
  .player-fill { height: 100%; border-radius: 100px; background: #818cf8; transition: width 0.1s linear; }
  .player-times { display: flex; justify-content: space-between; font-family: 'DM Mono', monospace; font-size: 10px; color: rgba(255,255,255,0.3); }

  .file-pill {
    display: flex; align-items: center; gap: 10px;
    background: rgba(20,184,166,0.1); border: 1px solid rgba(20,184,166,0.2);
    border-radius: 10px; padding: 10px 14px; margin-bottom: 1.25rem;
  }
  .file-pill-icon { font-size: 18px; }
  .file-pill-name { font-size: 13px; font-weight: 600; color: #5eead4; flex: 1; font-family: 'DM Mono', monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .file-pill-size { font-size: 11px; color: rgba(94,234,212,0.5); font-family: 'DM Mono', monospace; }

  .analyze-btn {
    width: 100%; padding: 14px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border: none; border-radius: 12px;
    color: #fff; font-family: 'Syne', sans-serif;
    font-size: 15px; font-weight: 700; letter-spacing: 0.02em;
    cursor: pointer; transition: all 0.2s ease;
    position: relative; overflow: hidden;
  }
  .analyze-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.4); }
  .analyze-btn:active:not(:disabled) { transform: translateY(0); }
  .analyze-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .analyzing-bar { position: absolute; top: 0; left: -100%; height: 100%; width: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent); animation: shimmer 1.2s infinite; }
  @keyframes shimmer { 0%{left:-100%} 100%{left:100%} }

  .result { margin-top: 1.75rem; animation: slide-up 0.4s ease; }
  @keyframes slide-up { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

  .result-divider { height: 1px; background: rgba(255,255,255,0.06); margin-bottom: 1.5rem; }
  .result-label { font-size: 11px; font-family: 'DM Mono', monospace; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.25); margin-bottom: 0.75rem; }

  .classification-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
  .classification-val { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em; }
  .classification-val.human { color: #34d399; }
  .classification-val.ai { color: #f87171; }
  .classification-val.unknown { color: #fbbf24; }

  .confidence-wrap { text-align: right; }
  .confidence-num { font-size: 1.5rem; font-weight: 800; color: #f1f5f9; font-family: 'DM Mono', monospace; }
  .confidence-sub { font-size: 11px; color: rgba(255,255,255,0.3); font-family: 'DM Mono', monospace; }

  .confidence-bar-track { height: 4px; background: rgba(255,255,255,0.07); border-radius: 100px; overflow: hidden; margin-bottom: 1.25rem; }
  .confidence-bar-fill { height: 100%; border-radius: 100px; transition: width 1s cubic-bezier(0.4,0,0.2,1); }

  .explanation-box {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px; padding: 14px 16px;
    font-size: 13px; line-height: 1.7;
    color: rgba(255,255,255,0.5); font-family: 'DM Mono', monospace; margin-bottom: 1rem;
  }

  .share-row { display: flex; gap: 8px; margin-top: 0.5rem; }
  .share-btn {
    flex: 1; padding: 9px 12px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; color: rgba(255,255,255,0.55);
    font-family: 'DM Mono', monospace; font-size: 12px;
    cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .share-btn:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.85); border-color: rgba(255,255,255,0.2); }
  .share-btn.copied { background: rgba(52,211,153,0.1); border-color: rgba(52,211,153,0.3); color: #34d399; }

  .error-box {
    margin-top: 1rem; background: rgba(248,113,113,0.08);
    border: 1px solid rgba(248,113,113,0.2); border-radius: 10px;
    padding: 12px 14px; font-size: 13px; color: #fca5a5; font-family: 'DM Mono', monospace;
  }

  .history-card {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px; padding: 1.5rem; backdrop-filter: blur(20px);
  }
  .history-title {
    font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.5);
    letter-spacing: 0.08em; text-transform: uppercase;
    font-family: 'DM Mono', monospace; margin-bottom: 1rem;
    display: flex; align-items: center; justify-content: space-between;
  }
  .history-count { background: rgba(99,102,241,0.2); color: #a5b4fc; border-radius: 100px; padding: 2px 8px; font-size: 11px; }
  .history-empty { font-size: 12px; color: rgba(255,255,255,0.2); font-family: 'DM Mono', monospace; text-align: center; padding: 1.5rem 0; }
  .history-list { display: flex; flex-direction: column; gap: 8px; }
  .history-item {
    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px; padding: 10px 12px;
    cursor: pointer; transition: all 0.15s; animation: slide-up 0.3s ease;
  }
  .history-item:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.12); }
  .history-item-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
  .history-item-name { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.6); font-family: 'DM Mono', monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 130px; }
  .history-item-time { font-size: 10px; color: rgba(255,255,255,0.2); font-family: 'DM Mono', monospace; }
  .history-item-bottom { display: flex; align-items: center; gap: 6px; }
  .history-tag { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 6px; }
  .history-tag.human { background: rgba(52,211,153,0.15); color: #34d399; }
  .history-tag.ai { background: rgba(248,113,113,0.15); color: #f87171; }
  .history-tag.unknown { background: rgba(251,191,36,0.15); color: #fbbf24; }
  .history-conf { font-size: 11px; color: rgba(255,255,255,0.25); font-family: 'DM Mono', monospace; }
  .clear-btn { font-size: 11px; color: rgba(255,255,255,0.2); background: none; border: none; cursor: pointer; font-family: 'DM Mono', monospace; padding: 0; transition: color 0.15s; }
  .clear-btn:hover { color: #f87171; }
`;

function fmtTime(secs) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragover, setDragover] = useState(false);
  const [barWidth, setBarWidth] = useState(0);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const audioUrlRef = useRef(null);
  const waveCanvasRef = useRef(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = styles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    if (result?.confidenceScore) {
      const pct = parseFloat(result.confidenceScore);
      setTimeout(() => setBarWidth(isNaN(pct) ? 70 : pct), 100);
    }
  }, [result]);

  useEffect(() => {
    if (!file) return;
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    const url = URL.createObjectURL(file);
    audioUrlRef.current = url;
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.load();
      setPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
    }
    drawWaveform(file);
  }, [file]);

  const drawWaveform = async (f) => {
    try {
      const arrayBuffer = await f.arrayBuffer();
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      const data = audioBuffer.getChannelData(0);
      const canvas = waveCanvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const W = canvas.offsetWidth * dpr || 460;
      const H = 56 * dpr;
      canvas.width = W;
      canvas.height = H;
      const c = canvas.getContext("2d");
      const samples = 120;
      const step = Math.floor(data.length / samples);
      c.clearRect(0, 0, W, H);
      const barW = W / samples;
      for (let i = 0; i < samples; i++) {
        let sum = 0;
        for (let j = 0; j < step; j++) sum += Math.abs(data[i * step + j] || 0);
        const avg = sum / step;
        const h = Math.max(2 * dpr, avg * H * 2.5);
        const x = i * barW;
        const y = (H - h) / 2;
        c.fillStyle = `rgba(129,140,248,${0.3 + avg * 2})`;
        c.beginPath();
        c.roundRect(x + 1, y, barW - 2, h, 2);
        c.fill();
      }
      ctx.close();
    } catch (e) {}
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setResult(null); setError(null); setBarWidth(0); }
  };

  const convertToBase64 = (f) =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.readAsDataURL(f);
      r.onload = () => res(r.result.split(",")[1]);
      r.onerror = rej;
    });

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true); setError(null); setResult(null); setBarWidth(0);
    try {
      const base64Audio = await convertToBase64(file);
      const response = await fetch(
        "https://ai-voice-detector-qgjt.onrender.com/api/voice-detection",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-api-key": "sk_test_123456789" },
          body: JSON.stringify({ language: "English", audioFormat: "mp3", audioBase64: base64Audio }),
        }
      );
      const data = await response.json();
      setResult(data);
      setHistory(prev => [{
        id: Date.now(),
        fileName: file.name,
        fileSize: file.size,
        classification: data.classification,
        confidenceScore: data.confidenceScore,
        explanation: data.explanation,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }, ...prev].slice(0, 20));
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  };

  const seekTo = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    if (audioRef.current) audioRef.current.currentTime = pct * audioRef.current.duration;
  };

  const classColor = (c) => {
    if (!c) return "unknown";
    const l = c.toLowerCase();
    if (l.includes("human")) return "human";
    if (l.includes("ai") || l.includes("synthetic")) return "ai";
    return "unknown";
  };

  const barColor = (c) => {
    const t = classColor(c);
    if (t === "human") return "#34d399";
    if (t === "ai") return "#f87171";
    return "#fbbf24";
  };

  const confNum = result?.confidenceScore
    ? (parseFloat(result.confidenceScore) || 70).toFixed(0) + "%"
    : null;

  const handleCopy = () => {
    if (!result) return;
    const text = `AI Voice Detector Result\nFile: ${file?.name || "—"}\nClassification: ${result.classification}\nConfidence: ${result.confidenceScore}\nExplanation: ${result.explanation}`;
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const handleShare = async () => {
    if (!result) return;
    const text = `🎙️ Voice Analysis\nClassification: ${result.classification}\nConfidence: ${result.confidenceScore}`;
    if (navigator.share) { try { await navigator.share({ title: "AI Voice Detector", text }); } catch {} }
    else handleCopy();
  };

  const loadFromHistory = (item) => {
    setResult({ classification: item.classification, confidenceScore: item.confidenceScore, explanation: item.explanation });
    setBarWidth(0);
    setTimeout(() => { const p = parseFloat(item.confidenceScore); setBarWidth(isNaN(p) ? 70 : p); }, 100);
  };

  return (
    <div className="app">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      <audio
        ref={audioRef}
        onTimeUpdate={() => { if (!audioRef.current) return; setCurrentTime(audioRef.current.currentTime); setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0); }}
        onLoadedMetadata={() => { if (audioRef.current) setDuration(audioRef.current.duration); }}
        onEnded={() => { setPlaying(false); setProgress(0); setCurrentTime(0); }}
        style={{ display: "none" }}
      />

      <div className="main-col">
        <div className="card">
          <div className="header">
            <div className="badge"><div className="badge-dot" />voice analysis</div>
            <h1>AI Voice <span>Detector</span></h1>
            <p className="subtitle">// upload audio → get classification</p>
          </div>

          <div
            className={`drop-zone${dragover ? " dragover" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
            onDragLeave={() => setDragover(false)}
            onDrop={(e) => { e.preventDefault(); setDragover(false); const f = e.dataTransfer.files[0]; if (f) { setFile(f); setResult(null); setError(null); } }}
          >
            <input type="file" accept="audio/mp3,audio/*" onChange={handleFileChange} />
            <div className="drop-icon">🎙</div>
            <div className="drop-label">{file ? "Change file" : "Drop your audio here"}</div>
            <div className="drop-sub">MP3 · WAV · M4A</div>
          </div>

          {file && (
            <div className="waveform-wrap">
              <div className="waveform-label">Waveform</div>
              <canvas ref={waveCanvasRef} className="waveform" />
            </div>
          )}

          {file && (
            <div className="player-wrap">
              <button className="play-btn" onClick={togglePlay}>{playing ? "⏸" : "▶"}</button>
              <div className="player-bar-wrap">
                <div className="player-track" onClick={seekTo}>
                  <div className="player-fill" style={{ width: progress + "%" }} />
                </div>
                <div className="player-times">
                  <span>{fmtTime(currentTime)}</span>
                  <span>{duration ? fmtTime(duration) : "--:--"}</span>
                </div>
              </div>
            </div>
          )}

          {file && (
            <div className="file-pill">
              <span className="file-pill-icon">🎵</span>
              <span className="file-pill-name">{file.name}</span>
              <span className="file-pill-size">{(file.size / 1024).toFixed(0)} KB</span>
            </div>
          )}

          <button className="analyze-btn" onClick={handleSubmit} disabled={!file || loading}>
            {loading && <span className="analyzing-bar" />}
            {loading ? "Analyzing…" : "Analyze Voice"}
          </button>

          {error && <div className="error-box">⚠ {error}</div>}

          {result && (
            <div className="result">
              <div className="result-divider" />
              <div className="result-label">Analysis Result</div>
              <div className="classification-row">
                <span className={`classification-val ${classColor(result.classification)}`}>
                  {result.classification || "Unknown"}
                </span>
                <div className="confidence-wrap">
                  <div className="confidence-num">{confNum}</div>
                  <div className="confidence-sub">confidence</div>
                </div>
              </div>
              <div className="confidence-bar-track">
                <div className="confidence-bar-fill" style={{ width: barWidth + "%", background: barColor(result.classification) }} />
              </div>
              {result.explanation && (
                <>
                  <div className="result-label">Explanation</div>
                  <div className="explanation-box">{result.explanation}</div>
                </>
              )}
              <div className="share-row">
                <button className={`share-btn${copied ? " copied" : ""}`} onClick={handleCopy}>
                  {copied ? "✓ Copied!" : "⎘ Copy result"}
                </button>
                <button className="share-btn" onClick={handleShare}>↗ Share</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="history-col">
        <div className="history-card">
          <div className="history-title">
            <span>History</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {history.length > 0 && <span className="history-count">{history.length}</span>}
              {history.length > 0 && <button className="clear-btn" onClick={() => setHistory([])}>clear</button>}
            </div>
          </div>
          {history.length === 0 ? (
            <div className="history-empty">No analyses yet.<br />Results will appear here.</div>
          ) : (
            <div className="history-list">
              {history.map(item => (
                <div key={item.id} className="history-item" onClick={() => loadFromHistory(item)}>
                  <div className="history-item-top">
                    <span className="history-item-name">{item.fileName}</span>
                    <span className="history-item-time">{item.time}</span>
                  </div>
                  <div className="history-item-bottom">
                    <span className={`history-tag ${classColor(item.classification)}`}>{item.classification || "Unknown"}</span>
                    <span className="history-conf">{item.confidenceScore ? (parseFloat(item.confidenceScore) || 0).toFixed(0) + "%" : "–"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}