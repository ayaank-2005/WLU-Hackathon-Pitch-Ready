import { useState, useRef, useCallback, useEffect } from 'react';

const CAMERA_ZONE = {
  xMin: 0.2,
  xMax: 0.8,
  yMin: 0,
  yMax: 0.3,
};

function loadWebGazer(): Promise<any> {
  if ((window as any).webgazer) return Promise.resolve((window as any).webgazer);

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://webgazer.cs.brown.edu/webgazer.js';
    script.onload = () => {
      if ((window as any).webgazer) resolve((window as any).webgazer);
      else reject(new Error('WebGazer loaded but not available on window'));
    };
    script.onerror = () => reject(new Error('Failed to load WebGazer script'));
    document.head.appendChild(script);
  });
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
  const webgazerRef = useRef<any>(null);

  const startTracking = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const wg = await loadWebGazer();
      webgazerRef.current = wg;

      wg.params.showVideoPreview = false;
      wg.setRegression('ridge')
        .setGazeListener((data: any) => {
          if (data) {
            const x = data.x / window.innerWidth;
            const y = data.y / window.innerHeight;
            setGazePosition({ x: data.x, y: data.y });

            const looking = x >= CAMERA_ZONE.xMin && x <= CAMERA_ZONE.xMax &&
                            y >= CAMERA_ZONE.yMin && y <= CAMERA_ZONE.yMax;
            setIsLookingAtCamera(looking);
            lookingSamplesRef.current.push(looking);
          }
        });

      wg.showVideo(false);
      wg.showPredictionPoints(false);
      wg.showFaceOverlay(false);
      wg.showFaceFeedbackBox(false);

      await wg.begin();

      setIsTracking(true);
      isTrackingRef.current = true;
      setIsLoading(false);

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
      console.warn('Eye tracking failed:', err);
    }
  }, []);

  const stopTracking = useCallback(() => {
    isTrackingRef.current = false;
    setIsTracking(false);

    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }

    if (webgazerRef.current) {
      try {
        webgazerRef.current.end();
      } catch { /* already ended */ }
      webgazerRef.current = null;
    }

    // Clean up any WebGazer DOM elements
    ['webgazerVideoContainer', 'webgazerVideoFeed', 'webgazerFaceFeedbackBox', 'webgazerGazeDot'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
  }, []);

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
