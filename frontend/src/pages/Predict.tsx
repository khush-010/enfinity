import { useState, useCallback, useRef } from "react";
import { Upload, Loader2, AlertCircle, RotateCcw } from "lucide-react";
import ImageComparison from "@/components/ImageComparison";

const API_URL = "http://localhost:8000/predict/";

const Predict = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleSubmit = async () => {
    if (!file) { setError("Please select an image first."); return; }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(API_URL, { method: "POST", body: formData });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const contentType = response.headers.get("content-type") || "";

      if (contentType.startsWith("image/")) {
        const blob = await response.blob();
        setResult(URL.createObjectURL(blob));
      } else {
        const json = await response.json();
        if (json.image) {
          // base64
          const src = json.image.startsWith("data:") ? json.image : `data:image/png;base64,${json.image}`;
          setResult(src);
        } else if (json.url) {
          setResult(json.url);
        } else {
          throw new Error("Unexpected response format from server.");
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to get prediction. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container max-w-4xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Run <span className="text-gradient">Prediction</span></h1>
          <p className="text-muted-foreground">Upload an offroad image and get a semantic segmentation result from the AI model.</p>
        </div>

        {/* Upload Zone */}
        {!preview && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`glass rounded-xl p-16 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
              dragActive ? "border-primary bg-primary/5 glow-primary" : "hover:border-muted-foreground/30"
            }`}
          >
            <Upload className={`w-10 h-10 ${dragActive ? "text-primary" : "text-muted-foreground"}`} />
            <p className="text-muted-foreground text-center">
              <span className="font-semibold text-foreground">Click to upload</span> or drag & drop
            </p>
            <p className="text-xs text-muted-foreground">PNG, JPG, WEBP — max 10MB</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>
        )}

        {/* Preview + Actions */}
        {preview && !result && (
          <div className="space-y-6">
            <div className="glass rounded-xl overflow-hidden">
              <img src={preview} alt="Preview" className="w-full max-h-[500px] object-contain bg-background" />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 glow-primary"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? "Analyzing…" : "Run Segmentation"}
              </button>
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-semibold hover:bg-secondary transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-3 text-muted-foreground py-8 justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="font-mono text-sm">Processing image through the model…</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-sm">Prediction Failed</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
        )}

        {/* Result */}
        {result && preview && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Results</h2>
            <ImageComparison original={preview} segmented={result} />
            <p className="text-xs text-muted-foreground text-center">Drag the slider to compare original vs segmented output</p>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-semibold hover:bg-secondary transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Try Another Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Predict;
