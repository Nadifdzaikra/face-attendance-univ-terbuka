"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import * as CgIcons from "react-icons/cg";

interface AttendanceCameraProps {
  onCapture: (base64Image: string) => void;
  disabled?: boolean;
  loading?: boolean;
  autoCapture?: boolean; // Enable automatic capture when face detected
}

export default function AttendanceCamera({ 
  onCapture, 
  disabled = false,
  loading = false,
  autoCapture = false
}: AttendanceCameraProps) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceStatus, setFaceStatus] = useState<string>("Mencari wajah...");
  const [canCapture, setCanCapture] = useState(false);
  const [faceapi, setFaceapi] = useState<any>(null);
  const lastCaptureTimeRef = useRef<number>(0); // Debounce timer untuk prevent repeated API calls

  // Load face-api.js dynamically
  useEffect(() => {
    const loadFaceApi = async () => {
      try {
        const faceapiModule = await import("@vladmandic/face-api");
        setFaceapi(faceapiModule);
      } catch (err) {
        console.error("Error loading face-api:", err);
      }
    };
    loadFaceApi();
  }, []);

  // Load face detection models
  useEffect(() => {
    if (!faceapi) return;
    
    const loadModels = async () => {
      const MODEL_URLS = [
        "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model",
        "https://raw.githubusercontent.com/vladmandic/face-api/master/model",
      ];

      let loaded = false;
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
        }
      }

      if (!loaded) {
        console.error("Error loading models from all sources");
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
          if (box.x === null || box.y === null || box.width === null || box.height === null || 
              isNaN(box.x) || isNaN(box.y) || isNaN(box.width) || isNaN(box.height)) {
            setFaceDetected(false);
            setFaceStatus("⏳ Mempersiapkan deteksi...");
            setCanCapture(false);
            return;
          }

          setFaceDetected(true);
          const landmarks = detections.landmarks;

          const faceWidth = box.width;
          const faceHeight = box.height;
          const videoWidth = video.videoWidth;
          const videoHeight = video.videoHeight;

          const facePercentage = (faceWidth * faceHeight) / (videoWidth * videoHeight);

          if (facePercentage < 0.05) {
            setFaceStatus("❌ Wajah terlalu jauh, dekatkan wajah Anda");
            setCanCapture(false);
          } else if (facePercentage > 0.4) {
            setFaceStatus("❌ Wajah terlalu dekat, jauhkan sedikit");
            setCanCapture(false);
          } else {
            const nose = landmarks.getNose();
            const leftEye = landmarks.getLeftEye();
            const rightEye = landmarks.getRightEye();

            const noseX = nose[3].x;
            const leftEyeX = leftEye[0].x;
            const rightEyeX = rightEye[3].x;
            const eyeCenter = (leftEyeX + rightEyeX) / 2;

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
              
              const color = canCapture ? "#f59e0b" : "#ef4444";
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

    const interval = setInterval(detectFace, 100);
    return () => clearInterval(interval);
  }, [modelsLoaded, canCapture, faceapi]);

  // Capture foto dari webcam dengan debounce
  const captureHandler = useCallback(() => {
    if (!canCapture) {
      return;
    }

    const now = Date.now();
    const timeSinceLastCapture = now - lastCaptureTimeRef.current;

    // Debounce: tunggu minimum 3 detik sebelum capture berikutnya
    if (timeSinceLastCapture < 3000) {
      console.log("⏳ Tunggu sebelum capture berikutnya...");
      return;
    }

    lastCaptureTimeRef.current = now;

    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      const base64Image = imageSrc.split(",")[1];
      // Kirim base64 image ke parent component
      onCapture(base64Image);
    }
  }, [canCapture, onCapture]);

  useEffect(() => {
    if (!autoCapture || !canCapture || loading) {
      return;
    }

    const now = Date.now();
    const timeSinceLastCapture = now - lastCaptureTimeRef.current;

    if (timeSinceLastCapture >= 90000) {
      lastCaptureTimeRef.current = now;
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        const base64Image = imageSrc.split(",")[1];
        onCapture(base64Image);
      }
    }
  }, [autoCapture, canCapture, loading, onCapture]);

  return (
    <div className="space-y-4">
      {/* Status Deteksi Wajah */}
      <div className={`flex items-center gap-2 rounded-lg p-3 text-sm font-medium transition-all ${
        canCapture 
          ? "bg-linear-to-r from-green-50 to-emerald-50 text-green-700 shadow-sm ring-2 ring-green-500/20 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400 dark:ring-green-500/30" 
          : "bg-linear-to-r from-red-50 to-orange-50 text-red-700 shadow-sm ring-2 ring-red-500/20 dark:from-red-900/30 dark:to-orange-900/30 dark:text-red-400 dark:ring-red-500/30"
      }`}>
        <div className="shrink-0">
          {canCapture ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          {modelsLoaded ? faceStatus : "⏳ Memuat model deteksi wajah..."}
        </div>
      </div>

      {/* Webcam */}
      <div className="relative overflow-hidden rounded-xl border-2 border-zinc-200 bg-zinc-900 shadow-md dark:border-zinc-600">
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
        <canvas
          ref={canvasRef}
          className="absolute left-0 top-0 h-full w-full"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
        
        {/* Capture Button - Commented for auto-capture */}
        {/* <button
          type="button"
          onClick={captureHandler}
          disabled={!canCapture || !modelsLoaded || disabled || loading}
          className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-linear-to-r from-amber-600 to-amber-700 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:from-amber-700 hover:to-amber-800 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 disabled:opacity-60 disabled:hover:scale-100"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{loading ? "Memproses..." : "Ambil Foto"}</span>
        </button> */}
      </div>
    </div>
  );
}
