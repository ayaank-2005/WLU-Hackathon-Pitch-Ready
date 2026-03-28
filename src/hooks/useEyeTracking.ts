import { useState, useRef, useCallback, useEffect } from 'react';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

let landmarkerPromise: Promise<FaceLandmarker> | null = null;

async function getLandmarker(): Promise<FaceLandmarker> {
  if (landmarkerPromise) return landmarkerPromise;

  landmarkerPromise = (async () => {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm'
    );
    return FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numFaces: 1,
      outputFaceBlendshapes: false,
      outputFacialTransformationMatrixes: false,
    });
  })();

  return landmarkerPromise;
}

function isLookingForward(landmarks: Array<{ x: number; y: number; z: number }>): boolean {
  if (!landmarks || landmarks.length < 264) return false;

  const nose = landmarks[1];
  const eyeL = landmarks[33];
  const eyeR = landmarks[263];
  if (!nose || !eyeL || !eyeR) return false;

  const minX = Math.min(eyeL.x, eyeR.x);
  const maxX = Math.max(eyeL.x, eyeR.x);
  const span = maxX - minX;
  if (span < 0.01) return false;

  const ratio = (nose.x - minX) / span;
  return ratio >= 0.15 && ratio <= 0.85;
}

export function useEyeTracking() {
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLookingAtCamera, setIsLookingAtCamera] = useState(false);
  const [eyeContactPercent, setEyeContactPercent] = useState(0);
  const [gazePosition, setGazePosition] = useState<{ x: number; y: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const lookingSamplesRef = useRef<boolean[]>([]);
  const isTrackingRef = useRef(false);
  const updateIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rafRef = useRef<number | null>(null);
  const hiddenVideoRef = useRef<HTMLVideoElement | null>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);

  const cleanup = useCallback(() => {
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (hiddenVideoRef.current) {
      hiddenVideoRef.current.srcObject = null;
      hiddenVideoRef.current.remove();
      hiddenVideoRef.current = null;
    }
  }, []);

  const startTracking = useCallback(async (stream: MediaStream) => {
    setIsLoading(true);
    setError(null);
    lookingSamplesRef.current = [];

    try {
      const video = document.createElement('video');
      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      video.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none';
      document.body.appendChild(video);
      hiddenVideoRef.current = video;

      await video.play();
      await new Promise<void>(resolve => {
        if (video.readyState >= 2) return resolve();
        video.addEventListener('loadeddata', () => resolve(), { once: true });
      });

      const landmarker = await getLandmarker();
      landmarkerRef.current = landmarker;

      setIsTracking(true);
      isTrackingRef.current = true;
      setIsLoading(false);

      let lastTime = -1;

      const processFrame = () => {
        if (!isTrackingRef.current || !hiddenVideoRef.current) return;

        const v = hiddenVideoRef.current;
        const now = performance.now();

        if (v.readyState >= 2 && v.videoWidth > 0 && now !== lastTime) {
          lastTime = now;
          try {
            const result = landmarker.detectForVideo(v, now);

            if (result.faceLandmarks && result.faceLandmarks.length > 0) {
              const lm = result.faceLandmarks[0];
              const looking = isLookingForward(lm);
              setIsLookingAtCamera(looking);
              lookingSamplesRef.current.push(looking);

              const nose = lm[1];
              if (nose) setGazePosition({ x: nose.x * v.videoWidth, y: nose.y * v.videoHeight });
            } else {
              setIsLookingAtCamera(false);
              lookingSamplesRef.current.push(false);
            }
          } catch { /* skip frame */ }
        }

        if (isTrackingRef.current) {
          rafRef.current = requestAnimationFrame(processFrame);
        }
      };

      rafRef.current = requestAnimationFrame(processFrame);

      updateIntervalRef.current = setInterval(() => {
        const samples = lookingSamplesRef.current;
        if (samples.length > 0) {
          const lookingCount = samples.filter(Boolean).length;
          setEyeContactPercent(Math.round((lookingCount / samples.length) * 100));
        }
      }, 2000);
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || 'Eye tracking unavailable');
      console.warn('Eye tracking init failed:', err);
      cleanup();
    }
  }, [cleanup]);

  const stopTracking = useCallback(() => {
    isTrackingRef.current = false;
    setIsTracking(false);
    cleanup();
  }, [cleanup]);

  const getFinalPercent = useCallback(() => {
    const samples = lookingSamplesRef.current;
    if (samples.length === 0) return 0;
    return Math.round((samples.filter(Boolean).length / samples.length) * 100);
  }, []);

  useEffect(() => {
    return () => {
      if (isTrackingRef.current) stopTracking();
    };
  }, [stopTracking]);

  return {
    isTracking,
    isLoading,
    isLookingAtCamera,
    eyeContactPercent,
    gazePosition,
    error,
    startTracking,
    stopTracking,
    getFinalPercent,
  };
}
