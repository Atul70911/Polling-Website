// src/Components/VantaBackground.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import RINGS from "vanta/dist/vanta.rings.min";
import "../Style/VantaBackground.css";

const VantaBackground = ({ children, className = "", options = {} }) => {
  const vantaRef = useRef(null);
  const effectRef = useRef(null);

  useEffect(() => {
    if (!effectRef.current) {
      effectRef.current = RINGS({
        el: vantaRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        scale: 1.0,
        scaleMobile: 1.0,
        ...options,
      });
    }

    return () => {
      effectRef.current?.destroy();
      effectRef.current = null;
    };
    // If you want options to change, memoize `options` in parent; objects re-trigger effects. [web:377][web:373]
  }, []);

  return (
    <div className={`vantaWrap ${className}`}>
      <div ref={vantaRef} className="vantaBg" />
      <div className="vantaContent">{children}</div>
    </div>
  );
};

export default VantaBackground;
