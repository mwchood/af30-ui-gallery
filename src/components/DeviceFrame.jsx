import { useEffect, useRef, useState } from 'react';

export function DeviceFrame({ children, className = '' }) {
  const hostRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    const update = () => {
      const widthScale = (host.clientWidth - 32) / 1280;
      const heightScale = (host.clientHeight - 32) / 720;
      setScale(Math.min(widthScale, heightScale, 1));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="device-stage" ref={hostRef}>
      <div
        className={`device-frame ${className}`}
        style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        {children}
      </div>
    </main>
  );
}
