"use client";

import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from "motion/react";
import { useRef, useState } from "react";
import "./ElasticSlider.css";

const MAX_OVERFLOW = 40;

export default function ElasticSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className = "",
  leftIcon = null,
  rightIcon = null,
  accentColor = "#e6007e",
}) {
  return (
    <div className={`elastic-slider-container ${className}`} style={{ "--elastic-accent": accentColor }}>
      <Slider value={value} onChange={onChange} min={min} max={max} step={step} leftIcon={leftIcon} rightIcon={rightIcon} />
    </div>
  );
}

function Slider({ value, onChange, min, max, step, leftIcon, rightIcon }) {
  const sliderRef = useRef(null);
  const [region, setRegion] = useState("middle");
  const clientX = useMotionValue(0);
  const overflow = useMotionValue(0);
  const scale = useMotionValue(1);

  useMotionValueEvent(clientX, "change", (latest) => {
    if (sliderRef.current) {
      const { left, right } = sliderRef.current.getBoundingClientRect();
      let newValue;

      if (latest < left) {
        setRegion("left");
        newValue = left - latest;
      } else if (latest > right) {
        setRegion("right");
        newValue = latest - right;
      } else {
        setRegion("middle");
        newValue = 0;
      }

      overflow.jump(decay(newValue, MAX_OVERFLOW));
    }
  });

  const handlePointerMove = (e) => {
    if (e.buttons > 0 && sliderRef.current) {
      const { left, width } = sliderRef.current.getBoundingClientRect();
      let newValue = min + ((e.clientX - left) / width) * (max - min);

      newValue = Math.round(newValue / step) * step;
      newValue = Math.min(Math.max(newValue, min), max);
      onChange(newValue);
      clientX.jump(e.clientX);
    }
  };

  const handlePointerDown = (e) => {
    handlePointerMove(e);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerUp = () => {
    animate(overflow, 0, { type: "spring", bounce: 0.5 });
  };

  const getRangePercentage = () => {
    const totalRange = max - min;
    if (totalRange === 0) return 0;
    return ((value - min) / totalRange) * 100;
  };

  return (
    <motion.div
      onHoverStart={() => animate(scale, 1.15)}
      onHoverEnd={() => animate(scale, 1)}
      onTouchStart={() => animate(scale, 1.15)}
      onTouchEnd={() => animate(scale, 1)}
      style={{
        scale,
        opacity: useTransform(scale, [1, 1.15], [0.85, 1]),
      }}
      className="elastic-slider-wrapper"
    >
      {leftIcon && (
        <motion.div
          animate={{
            scale: region === "left" ? [1, 1.4, 1] : 1,
            transition: { duration: 0.25 },
          }}
          style={{
            x: useTransform(() => (region === "left" ? -overflow.get() / scale.get() : 0)),
          }}
        >
          {leftIcon}
        </motion.div>
      )}

      <div
        ref={sliderRef}
        className="elastic-slider-root"
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onLostPointerCapture={handlePointerUp}
      >
        <motion.div
          style={{
            scaleX: useTransform(() => {
              if (sliderRef.current) {
                const { width } = sliderRef.current.getBoundingClientRect();
                return 1 + overflow.get() / width;
              }
              return 1;
            }),
            scaleY: useTransform(overflow, [0, MAX_OVERFLOW], [1, 0.8]),
            transformOrigin: useTransform(() => {
              if (sliderRef.current) {
                const { left, width } = sliderRef.current.getBoundingClientRect();
                return clientX.get() < left + width / 2 ? "right" : "left";
              }
              return "left";
            }),
            height: useTransform(scale, [1, 1.15], [10, 16]),
          }}
          className="elastic-slider-track-wrapper"
        >
          <div className="elastic-slider-track">
            <div className="elastic-slider-range" style={{ width: `${getRangePercentage()}%` }} />
          </div>
        </motion.div>
      </div>

      {rightIcon && (
        <motion.div
          animate={{
            scale: region === "right" ? [1, 1.4, 1] : 1,
            transition: { duration: 0.25 },
          }}
          style={{
            x: useTransform(() => (region === "right" ? overflow.get() / scale.get() : 0)),
          }}
        >
          {rightIcon}
        </motion.div>
      )}
    </motion.div>
  );
}

function decay(value, max) {
  if (max === 0) return 0;
  const entry = value / max;
  const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);
  return sigmoid * max;
}
