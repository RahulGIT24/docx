'use client';

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa";

const RULER_WIDTH = 816;
const DEFAULT_MARGIN = 50;
const MIN_GAP = 100;

interface RulerProps {
  leftMargin?: number;
  rightMargin?: number;
  onLeftChange?: (value: number) => void;
  onRightChange?: (value: number) => void;
}

export const Ruler = ({
  leftMargin: externalLeft,
  rightMargin: externalRight,
  onLeftChange,
  onRightChange,
}: RulerProps) => {
  const markers = Array.from({ length: 83 }, (_, i) => i);
  const params = useSearchParams();

  const readOnly = Boolean(params.get("token"));

  const [leftMargin, setLeftMargin] = useState(externalLeft ?? DEFAULT_MARGIN);
  const [rightMargin, setRightMargin] = useState(externalRight ?? DEFAULT_MARGIN);

  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);

  const rulerRef = useRef<HTMLDivElement>(null);

  // Update internal state if external props change
  useEffect(() => {
    if (externalLeft !== undefined) setLeftMargin(externalLeft);
  }, [externalLeft]);

  useEffect(() => {
    if (externalRight !== undefined) setRightMargin(externalRight);
  }, [externalRight]);

  const updateFromMouse = (clientX: number) => {
    if (!rulerRef.current) return;
    const container = rulerRef.current.querySelector("#ruler-container");
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const clampedX = Math.max(0, Math.min(RULER_WIDTH, relativeX));

    if (isDraggingLeft) {
      const maxLeft = RULER_WIDTH - rightMargin - MIN_GAP;
      const newLeft = Math.min(clampedX, maxLeft);
      setLeftMargin(newLeft);
      onLeftChange?.(newLeft);
    }

    if (isDraggingRight) {
      const maxRight = RULER_WIDTH - leftMargin - MIN_GAP;
      const newRight = Math.min(RULER_WIDTH - clampedX, maxRight);
      setRightMargin(newRight);
      onRightChange?.(newRight);
    }
  };

  // Handle dragging globally
  useEffect(() => {
    if (!isDraggingLeft && !isDraggingRight) return;

    const onMove = (e: MouseEvent) => updateFromMouse(e.clientX);
    const onUp = () => {
      setIsDraggingLeft(false);
      setIsDraggingRight(false);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDraggingLeft, isDraggingRight, leftMargin, rightMargin]);

  return (
    <div
      ref={rulerRef}
      className="h-6 border-b border-gray-300 flex relative select-none print:hidden"
    >
      <div id="ruler-container" className="w-[816px] mx-auto h-full relative">
        <Marker
          position={leftMargin}
          isLeft
          isDragging={isDraggingLeft}
          disabled={readOnly}
          onMouseDown={() => !readOnly && setIsDraggingLeft(true)}
          onDoubleClick={() => !readOnly && setLeftMargin(DEFAULT_MARGIN)}
        />

        <Marker
          position={rightMargin}
          isLeft={false}
          isDragging={isDraggingRight}
          disabled={readOnly}
          onMouseDown={() => !readOnly && setIsDraggingRight(true)}
          onDoubleClick={() => !readOnly && setRightMargin(DEFAULT_MARGIN)}
        />

        <div className="relative h-full w-full">
          {markers.map((marker) => {
            const position = (marker * RULER_WIDTH) / 82;
            return (
              <div
                key={marker}
                className="absolute bottom-0 text-xs text-neutral-600"
                style={{ left: position }}
              >
                <div
                  className={`w-px bg-neutral-500 ${
                    marker % 10 === 0 ? "h-2" : "h-1.5"
                  }`}
                />
                {marker % 10 === 0 && <span>{marker / 10 + 1}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface MarkerProps {
  position: number;
  isLeft: boolean;
  isDragging: boolean;
  disabled: boolean;
  onMouseDown: () => void;
  onDoubleClick: () => void;
}

const Marker = ({
  position,
  isLeft,
  isDragging,
  disabled,
  onMouseDown,
  onDoubleClick,
}: MarkerProps) => {
  return (
    <div
      className={`absolute top-0 w-4 h-full z-10 -ml-2 ${
        disabled ? "cursor-default" : "cursor-ew-resize"
      }`}
      style={{ [isLeft ? "left" : "right"]: position }}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    >
      <FaCaretDown className="absolute left-1/2 top-0 -translate-x-1/2 fill-blue-500" />

      {isDragging && (
        <div
          className="absolute left-1/2 top-4 -translate-x-1/2"
          style={{
            height: "100vh",
            width: 1,
            backgroundColor: "#3b72f6",
          }}
        />
      )}
    </div>
  );
};
