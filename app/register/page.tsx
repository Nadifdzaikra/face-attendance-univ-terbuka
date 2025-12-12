"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceStatus, setFaceStatus] = useState<string>("Mencari wajah...");
  const [canCapture, setCanCapture] = useState(false);
  const [faceapi, setFaceapi] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const loadFaceApi = async () => {
      try {
        const faceapiModule = await import("@vladmandic/face-api");
        setFaceapi(faceapiModule);
      } catch (err) {
        console.error("Error loading face-api:", err);
        setError("Gagal memuat library deteksi wajah");
      }
    };
    loadFaceApi();
  }, []);

  useEffect(() => {
    if (!faceapi) return;
    
    const loadModels = async () => {
      const MODEL_URLS = [
        "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model", // CDN utama (cepat & reliable)
        "https://raw.githubusercontent.com/vladmandic/face-api/master/model", // GitHub raw (fallback)
      ];

      let loaded = false;
      let lastError = null;

      for (const MODEL_URL of MODEL_URLS) {
        try {
          console.log(`Loading models from: ${MODEL_URL}`);
          await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
          await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
          await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
          setModelsLoaded(true);
          console.log("✅ Face detection models loaded successfully from:", MODEL_URL);
          loaded = true;
          break;
        } catch (err) {
          console.warn(`❌ Failed to load from ${MODEL_URL}:`, err);
          lastError = err;
        }
      }

      if (!loaded) {
        console.error("Error loading models from all sources:", lastError);
        setError("Gagal memuat model deteksi wajah. Periksa koneksi internet Anda.");
      }
    };
    loadModels();
  }, [faceapi]);

  // Deteksi wajah secara real-time
  useEffect(() => {
    if (!modelsLoaded || !webcamRef.current || !faceapi) return;

    const detectFace = async () => {
      const video = webcamRef.current?.video;
      if (!video || video.readyState !== 4) return;

      try {
        const detections = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        if (detections && detections.detection && detections.detection.box) {
          const { box } = detections.detection;
          
          // Validasi bahwa box memiliki nilai numerik yang valid
          if (box.x === null || box.y === null || box.width === null || box.height === null) {
            setFaceDetected(false);
            setFaceStatus("⏳ Mempersiapkan deteksi...");
            setCanCapture(false);
            return;
          }

          setFaceDetected(true);
          const landmarks = detections.landmarks;

          // Hitung ukuran wajah (untuk cek jarak)
          const faceWidth = box.width;
          const faceHeight = box.height;
          const videoWidth = video.videoWidth;
          const videoHeight = video.videoHeight;

          // Hitung persentase wajah terhadap video
          const facePercentage = (faceWidth * faceHeight) / (videoWidth * videoHeight);

          // Cek apakah wajah terlalu dekat atau terlalu jauh
          if (facePercentage < 0.05) {
            setFaceStatus("❌ Wajah terlalu jauh, dekatkan wajah Anda");
            setCanCapture(false);
          } else if (facePercentage > 0.4) {
            setFaceStatus("❌ Wajah terlalu dekat, jauhkan sedikit");
            setCanCapture(false);
          } else {
            // Cek orientasi wajah (menghadap depan atau miring)
            const nose = landmarks.getNose();
            const leftEye = landmarks.getLeftEye();
            const rightEye = landmarks.getRightEye();

            // Hitung posisi hidung relatif terhadap mata
            const noseX = nose[3].x; // Ujung hidung
            const leftEyeX = leftEye[0].x;
            const rightEyeX = rightEye[3].x;
            const eyeCenter = (leftEyeX + rightEyeX) / 2;

            // Toleransi: hidung harus di tengah (±15% dari lebar wajah)
            const noseDiff = Math.abs(noseX - eyeCenter);
            const tolerance = faceWidth * 0.15;

            if (noseDiff > tolerance) {
              setFaceStatus("❌ Hadapkan wajah ke depan, jangan miring");
              setCanCapture(false);
            } else {
              setFaceStatus("✅ Posisi sempurna! Siap capture");
              setCanCapture(true);
            }
          }

          // Gambar kotak deteksi di canvas
          if (canvasRef.current) {
            const canvas = canvasRef.current;
            const displaySize = {
              width: video.offsetWidth,
              height: video.offsetHeight,
            };
            faceapi.matchDimensions(canvas, displaySize);
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              
              // Gambar kotak dengan warna sesuai status
              const color = canCapture ? "#22c55e" : "#ef4444";
              ctx.strokeStyle = color;
              ctx.lineWidth = 3;
              ctx.strokeRect(
                resizedDetections.detection.box.x,
                resizedDetections.detection.box.y,
                resizedDetections.detection.box.width,
                resizedDetections.detection.box.height
              );
            }
          }
        } else {
          setFaceDetected(false);
          setFaceStatus("❌ Tidak ada wajah terdeteksi");
          setCanCapture(false);
          
          // Clear canvas
          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) {
              ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }
          }
        }
      } catch (err) {
        console.error("Face detection error:", err);
        setFaceDetected(false);
        setCanCapture(false);
      }
    };

    const interval = setInterval(detectFace, 100); // Deteksi setiap 100ms
    return () => clearInterval(interval);
  }, [modelsLoaded, canCapture, faceapi]);

  // Capture foto dari webcam
  const captureHandler = useCallback(() => {
    if (!canCapture) {
      setError("Posisi wajah belum sesuai. Ikuti instruksi di layar.");
      return;
    }

    if (capturedImages.length >= 3) {
      setError("Maksimal 3 foto sudah tercapai");
      return;
    }

    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      const base64Image = imageSrc.split(",")[1];
      setCapturedImages([...capturedImages, base64Image]);
      setError(null);
      
      if (capturedImages.length === 2) {
        setFaceStatus("✅ 3 Foto berhasil diambil! Siap register");
      } else {
        setFaceStatus(`✅ Foto ${capturedImages.length + 1} berhasil! Ambil ${2 - capturedImages.length} foto lagi`);
      }
    }
  }, [canCapture, capturedImages]);

  const resetImage = (index?: number) => {
    if (index !== undefined) {
      const newImages = capturedImages.filter((_, i) => i !== index);
      setCapturedImages(newImages);
    } else {
      setCapturedImages([]);
    }
    setError(null);
  };

  const registerHandler = async () => {
    if (!email || !password || !name || capturedImages.length !== 3) {
      setError("Email, password, nama harus diisi dan 3 foto harus diambil");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name,
          role: "mahasiswa",
        }),
      });

      if (!response.ok) {
        const json = await response.json().catch(() => ({}));
        throw new Error(json?.message || "Registrasi gagal");
      }

      const data = await response.json();
      console.log("Registration success:", data);
      
      router.push("/login");
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err?.message || "Registrasi gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 to-white dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      <div className="container mx-auto px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 transition-colors hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>

        {/* Main Card */}
        <div className="mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg border border-amber-100 dark:bg-zinc-800 dark:border-amber-900/30 dark:shadow-xl">
            {/* Header Card */}
            <div className="bg-linear-to-r from-amber-600 to-amber-700 px-6 py-7 dark:from-amber-700 dark:to-amber-800">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Registrasi
                  </h1>
                  <p className="mt-0.5 text-sm text-amber-100">
                    Daftar dengan pengenalan wajah
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              {/* Info Box */}
              {/* <div className="mb-4 rounded-lg border-2 border-green-200 bg-linear-to-r from-green-50 to-emerald-50 p-3 dark:border-green-800 dark:from-green-900/20 dark:to-emerald-900/20 sm:mb-5 sm:rounded-xl">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500 sm:h-7 sm:w-7">
                    <svg className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-0.5 text-xs font-semibold text-green-900 dark:text-green-300 sm:text-sm">
                      Informasi
                    </h3>
                    <p className="text-xs leading-relaxed text-green-800 dark:text-green-400 sm:text-sm">
                      Setelah registrasi, kunjungi halaman{" "}
                      <Link href="/detect-face" className="font-semibold underline decoration-2 underline-offset-2 transition-colors hover:text-green-600">
                        Recognize
                      </Link>{" "}
                      untuk mencoba deteksi wajah Anda.
                    </p>
                  </div>
                </div>
              </div> */}

              {/* Form */}
              <div className="space-y-4 sm:space-y-5">
                {/* Email Input */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-700 dark:text-zinc-200 sm:text-sm">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4">
                      <svg className="h-4 w-4 text-zinc-400 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border-2 border-zinc-200 bg-white py-2 pl-10 pr-3 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/10 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-500 dark:focus:border-amber-400 sm:rounded-xl sm:py-2.5 sm:pl-12 sm:pr-4"
                      placeholder="nama@email.com"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-700 dark:text-zinc-200 sm:text-sm">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4">
                      <svg className="h-4 w-4 text-zinc-400 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border-2 border-zinc-200 bg-white py-2 pl-10 pr-10 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/10 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-500 dark:focus:border-amber-400 sm:rounded-xl sm:py-2.5 sm:pl-12 sm:pr-12"
                      placeholder="Minimal 6 karakter"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300 sm:pr-4"
                    >
                      {showPassword ? (
                        <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Name Input */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-700 dark:text-zinc-200 sm:text-sm">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border-2 border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/10 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-500 dark:focus:border-amber-400 sm:rounded-xl sm:px-4 sm:py-2.5"
                    placeholder="Contoh: John Doe"
                  />
                </div>

            {/* Title Select - REMOVED */}
            {/* Title field tidak diperlukan lagi sesuai API baru */}

                {/* Webcam Capture */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-700 dark:text-zinc-200 sm:text-sm">
                    Capture Wajah <span className="text-red-500">*</span> <span className="text-[10px] font-normal text-zinc-500 sm:text-xs">(3 Foto)</span>
                  </label>
                  
                  {/* Status Deteksi Wajah */}
                  <div className={`mb-3 flex items-center gap-2 rounded-lg p-2.5 text-xs font-medium transition-all sm:gap-2.5 sm:rounded-xl sm:p-3 sm:text-sm ${
                    canCapture 
                      ? "bg-linear-to-r from-green-50 to-emerald-50 text-green-700 shadow-sm ring-2 ring-green-500/20 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400 dark:ring-green-500/30" 
                      : "bg-linear-to-r from-red-50 to-orange-50 text-red-700 shadow-sm ring-2 ring-red-500/20 dark:from-red-900/30 dark:to-orange-900/30 dark:text-red-400 dark:ring-red-500/30"
                  }`}>
                    <div className="shrink-0">
                      {canCapture ? (
                        <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      {modelsLoaded ? faceStatus : "⏳ Memuat model deteksi wajah..."}
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-lg border-2 border-zinc-200 bg-zinc-900 shadow-md dark:border-zinc-600 sm:rounded-xl sm:border-3">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="w-full"
                      videoConstraints={{
                        width: 1280,
                        height: 720,
                        facingMode: "user"
                      }}
                    />
                    {/* Canvas untuk gambar kotak deteksi */}
                    <canvas
                      ref={canvasRef}
                      className="absolute left-0 top-0 h-full w-full"
                    />
                    {/* Overlay gradient untuk estetika */}
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
                    
                    {/* Capture Button */}
                    <button
                      type="button"
                      onClick={captureHandler}
                      disabled={!canCapture || !modelsLoaded || capturedImages.length >= 3}
                      className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-linear-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-bold text-white shadow-lg transition-all hover:scale-105 hover:from-amber-600 hover:to-amber-700 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 disabled:opacity-60 disabled:hover:scale-100 sm:bottom-3 sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
                    >
                      <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Capture ({capturedImages.length}/3)</span>
                    </button>
                  </div>

                  {/* Preview Captured Images */}
                  {capturedImages.length > 0 && (
                    <div className="mt-4 space-y-3 sm:mt-5">
                      <div className="flex items-center justify-between">
                        <h3 className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-white sm:text-sm">
                          <svg className="h-4 w-4 text-green-500 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Foto Tersimpan ({capturedImages.length}/3)
                        </h3>
                        <button
                          type="button"
                          onClick={() => resetImage()}
                          className="flex items-center gap-1 text-xs font-medium text-red-600 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 sm:text-sm"
                        >
                          <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Reset Semua
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        {capturedImages.map((img, index) => (
                          <div key={index} className="group relative">
                            <div className="overflow-hidden rounded-lg border-2 border-zinc-200 shadow-sm transition-all group-hover:border-blue-400 group-hover:shadow-md dark:border-zinc-600 dark:group-hover:border-blue-500 sm:rounded-xl">
                              <img
                                src={`data:image/jpeg;base64,${img}`}
                                alt={`Captured ${index + 1}`}
                                className="aspect-square w-full object-cover"
                              />
                              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                            </div>
                            <button
                              type="button"
                              onClick={() => resetImage(index)}
                              className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition-all hover:scale-110 hover:bg-red-700 sm:-right-1.5 sm:-top-1.5 sm:h-7 sm:w-7"
                            >
                              <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                            <div className="absolute bottom-1.5 left-1.5 rounded-full bg-black/50 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm sm:bottom-2 sm:left-2 sm:px-2 sm:py-1 sm:text-xs">
                              #{index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Instructions */}
                <div className="rounded-lg border-2 border-amber-200 bg-linear-to-br from-amber-50 to-yellow-50 p-4 dark:border-amber-800 dark:from-amber-900/20 dark:to-yellow-900/20 sm:rounded-xl">
                  <div className="mb-2 flex items-center gap-1.5 sm:mb-2.5 sm:gap-2">
                    <svg className="h-4 w-4 text-amber-600 dark:text-amber-400 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xs font-bold text-amber-900 dark:text-amber-300 sm:text-sm">
                      📋 Instruksi Penggunaan
                    </h3>
                  </div>
                  <ol className="ml-3 space-y-1.5 text-[11px] text-amber-800 dark:text-amber-400 sm:ml-4 sm:space-y-2 sm:text-xs">
                    <li className="flex gap-1.5 sm:gap-2">
                      <span className="font-bold">1.</span>
                      <span>Izinkan akses kamera saat diminta browser.</span>
                    </li>
                    <li className="flex gap-1.5 sm:gap-2">
                      <span className="font-bold">2.</span>
                      <span>Posisikan wajah <strong>menghadap depan</strong> (jangan miring).</span>
                    </li>
                    <li className="flex gap-1.5 sm:gap-2">
                      <span className="font-bold">3.</span>
                      <span>Jaga jarak yang tepat (tidak terlalu dekat/jauh).</span>
                    </li>
                    <li className="flex gap-1.5 sm:gap-2">
                      <span className="font-bold">4.</span>
                      <span>Tunggu status <strong className="text-green-600 dark:text-green-400">"✅ Posisi sempurna"</strong>.</span>
                    </li>
                    <li className="flex gap-1.5 sm:gap-2">
                      <span className="font-bold">5.</span>
                      <span><strong>Ambil 3 foto</strong> dari angle sedikit berbeda.</span>
                    </li>
                  </ol>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-start gap-2 rounded-lg border-2 border-red-200 bg-linear-to-r from-red-50 to-rose-50 p-3 dark:border-red-800 dark:from-red-900/30 dark:to-rose-900/30 sm:gap-2.5 sm:rounded-xl sm:p-3.5">
                    <svg className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs font-medium text-red-700 dark:text-red-400 sm:text-sm">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={registerHandler}
                  disabled={!name || capturedImages.length !== 3 || loading}
                  className="group relative w-full overflow-hidden rounded-lg bg-linear-to-r from-amber-600 to-amber-700 px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.02] hover:from-amber-700 hover:to-amber-800 hover:shadow-lg disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 disabled:opacity-60 disabled:hover:scale-100 sm:rounded-xl sm:px-6 sm:py-3.5 sm:text-base"
                >
                  <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2">
                    {loading ? (
                      <>
                        <svg className="h-4 w-4 animate-spin sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mendaftar...
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Daftar Sekarang
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 z-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity group-hover:opacity-100"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
