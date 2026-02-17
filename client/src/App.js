import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState("");
const [platform, setPlatform] = useState("Instagram");

  
  const API = "https://ai-social-post-analyzer.onrender.com";

// wake backend first
const wakeServer = async () => {
  try {
    await fetch(API);
    console.log("Server awake");
  } catch (e) {
    console.log("Waking server...");
  }
};


  const upload = async () => {

  await wakeServer(); 
    if (!file) return alert("Please upload a file first");

    const form = new FormData();
    form.append("file", file);

    setLoading(true);
    setData(null);

    try {
      const API = "https://ai-social-post-analyzer.onrender.com";

const res = await axios.post(`${API}/upload`, form, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

      setData(res.data);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Analysis failed";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1>AI Social Post Analyzer</h1>
        <p className="subtitle">Upload an image or PDF to analyze its engagement quality</p>

        <label className="upload-box">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            hidden
          />
          {file ? file.name : "Click or Drag file here"}
        </label>

        <div className="extra-inputs">

  <textarea
    placeholder="Paste your original caption here..."
    value={caption}
    onChange={(e)=>setCaption(e.target.value)}
    rows={4}
    className="caption-box"
  />

  <select
    value={platform}
    onChange={(e)=>setPlatform(e.target.value)}
    className="platform-box"
  >
    <option>Instagram</option>
    <option>LinkedIn</option>
    <option>Twitter</option>
    <option>Facebook</option>
  </select>

</div>


        <button className="analyze-btn" onClick={upload} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>

        {loading && <div className="loader"></div>}

        {data && data.analysis && (
          <div className="result">
            <div className="grid">
              <div className="box">
                <h3>Sentiment</h3>
                <p>{data.analysis.sentiment}</p>
              </div>

              <div className="box">
                <h3>Engagement Score</h3>
                <p>{data.analysis.engagement_score}/10</p>
              </div>

              <div className="box">
                <h3>Tone</h3>
                <p>{data.analysis.tone}</p>
              </div>

              <div className="box">
                <h3>Audience</h3>
                <p>{data.analysis.target_audience}</p>
              </div>
            </div>

            <h4>Original Caption:</h4>
<p className="original-caption">{caption || "No caption provided"}</p>


            <h3>Improved Caption</h3>
            <div className="caption">{data.analysis.improved_caption}</div>

            <h3>Hashtags</h3>
            <div className="hashtags">
              {Array.isArray(data.analysis.hashtags) &&
                data.analysis.hashtags.map((tag, i) => (
                  <span key={i}>#{tag}</span>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;


