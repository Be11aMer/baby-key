import { useState, useCallback, useEffect } from 'react';

interface VendorDocument extends Document {
  webkitFullscreenElement?: Element | null;
  webkitFullscreenEnabled?: boolean;
  webkitExitFullscreen?: () => Promise<void> | void;
}

interface VendorElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void;
}

function isFullscreenSupported() {
  const doc = document as VendorDocument;
  const el = document.documentElement as VendorElement;
  return !!(doc.fullscreenEnabled || doc.webkitFullscreenEnabled || el.requestFullscreen || el.webkitRequestFullscreen);
}

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [supported] = useState(isFullscreenSupported);

  useEffect(() => {
    if (!supported) return;
    const doc = document as VendorDocument;
    const handleChange = () => setIsFullscreen(!!(doc.fullscreenElement || doc.webkitFullscreenElement));
    document.addEventListener('fullscreenchange', handleChange);
    document.addEventListener('webkitfullscreenchange', handleChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleChange);
      document.removeEventListener('webkitfullscreenchange', handleChange);
    };
  }, [supported]);

  const toggleFullscreen = useCallback(async () => {
    if (!supported) {
      // iPhone Safari has no Fullscreen API for arbitrary elements — fall back to a
      // manual "locked" state. Global touch handling already blocks scroll/zoom/pull-to-refresh.
      setIsFullscreen((prev) => !prev);
      return;
    }

    const doc = document as VendorDocument;
    const el = document.documentElement as VendorElement;

    try {
      const current = doc.fullscreenElement || doc.webkitFullscreenElement;
      if (!current) {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
      } else {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
      }
    } catch {
      // Fullscreen may be blocked by the browser
    }
  }, [supported]);

  return { isFullscreen, toggleFullscreen };
}
