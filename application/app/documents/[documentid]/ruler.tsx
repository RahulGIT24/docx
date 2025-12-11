import { useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa";

export const Ruler = () => {
  const markers = Array.from({ length: 83 }, (_, i) => i);

  const [leftMargin, setLeftMargin] = useState(50);
  const [rightMargin, setRightMargin] = useState(50);

  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);
  const rulerRef = useRef<HTMLDivElement>(null);

  const handleLeftMouseDown = () => {
    setIsDraggingLeft(true);
  };
  const handleRightMouseDown = () => {
    setIsDraggingRight(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if ((isDraggingLeft || isDraggingRight) && rulerRef.current) {
      const container = rulerRef.current.querySelector("#ruler-container");
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const relativeX = e.clientX - containerRect.left;
        const rawPosition = Math.max(0, Math.min(816, relativeX));

        if (isDraggingLeft) {
          const maxLeftPos = 816 - rightMargin - 100;
          const newLeftPos = Math.min(rawPosition, maxLeftPos);
          setLeftMargin(newLeftPos);
        } else if (isDraggingRight) {
          const maxRightPos = 816 - (leftMargin + 100);
          const newRightPos = Math.max(816 - rawPosition, 0);
          const constrainedRightMargin = Math.min(newRightPos, maxRightPos);
          setRightMargin(constrainedRightMargin);
        }
      }
    }
  };

  const handleMouseUp = () => {
    setIsDraggingRight(false);
    setIsDraggingLeft(false);
  };

  const handleLeftDoubleClick = () => {
    setLeftMargin(50);
  };
  const handleRightDoubleClick = () => {
    setRightMargin(50);
  };

  return (
    <div
      ref={rulerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseDown={() => {}}
      className="h-6 border-b border-gray-300 flex relative select-none print:hidden"
    >
      <div
        id="ruler-container"
        className="min-w-max flex justify-center w-[816px] mx-auto h-full relative"
      >
        <Marker
          position={leftMargin}
          isLeft={true}
          isDragging={isDraggingLeft}
          onDoubleClick={handleLeftDoubleClick}
          onMouseDown={handleLeftMouseDown}
        />
        <Marker
          position={rightMargin}
          isLeft={false}
          isDragging={isDraggingRight}
          onDoubleClick={handleRightDoubleClick}
          onMouseDown={handleRightMouseDown}
        />
        <div className="relative h-full w-[816px]">
          {markers.map((marker) => {
            const position = (marker * 816) / 82;

            return (
              <div
                key={marker}
                className="absolute bottom-0"
                style={{ left: `${position}px` }}
              >
                {marker % 10 === 0 && (
                  <>
                    <div className="absolute bottom-0 w-px h-2 bg-neutral-500" />
                    <span>{marker / 10 + 1}</span>
                  </>
                )}
                {marker % 5 == 0 && marker % 10 != 0 && (
                  <>
                    <div className="absolute bottom-0 w-px h-1.5 bg-neutral-500" />
                  </>
                )}
                {marker % 5 != 0 && marker % 10 != 0 && (
                  <>
                    <div className="absolute bottom-0 w-px h-1.5 bg-neutral-500" />
                  </>
                )}
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
  onMouseDown: () => void;
  onDoubleClick: () => void;
}

const Marker = ({
  position,
  isLeft,
  isDragging,
  onMouseDown,
  onDoubleClick,
}: MarkerProps) => {
  return (
    <div
      className="absolute top-0 w-4 h-full cursor-ew-resize z-5 group -ml-2:"
      style={{ [isLeft ? "left" : "right"]: `${position}px` }}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    >
      <FaCaretDown className="absolute left-1/2 top-0 h-full fill-blue-500 transform -translate-x-1/2" />
      <div className="absolute left-1/2 top-4 transform -translate-x-1/2 duration-150"
      style={{
        height:"100vh",
        width:"1px",
        transform:"scaleX(0.5)",
        backgroundColor:'#3b72f6',
        display: isDragging ? 'block' : 'none'
      }}
      />
    </div>
  );
};
