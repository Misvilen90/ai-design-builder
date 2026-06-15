import { useRef, useState } from "react";
import { useBuilderStore } from "../../../store/useBuilderStore";

const GRID_SIZE = 8;
const snap = (v: number) => Math.round(v / GRID_SIZE) * GRID_SIZE;

const CanvasWorkspace = () => {
  // refs
  const dragRef = useRef({
    id: null as string | null,
    offsetX: 0,
    offsetY: 0,
  });

  const resizeRef = useRef({
    id: null as string | null,
    direction: null as string | null,
    startX: 0,
    startY: 0,
    startW: 0,
    startH: 0,
  });


  // state
  const [guides, setGuides] = useState({
    vertical: null as number | null,
    horizontal: null as number | null,
  });

  // store
  const {
    pages,
    activePageId,
    setSelection,
    setSelectionIds,
    selectedComponentId,
    selectedComponentIds,
  } = useBuilderStore();

  const activePage = pages.find((p) => p.id === activePageId);

  if (!activePage) {
    return <div>No page selected</div>;
  }

  // guide detection
  const detectGuides = (movingId: string, left: number, top: number) => {
    let vertical: number | null = null;
    let horizontal: number | null = null;

    activePage.components.forEach((c) => {
      if (c.id === movingId) return;

      if (Math.abs(c.position.left - left) < 5) {
        vertical = c.position.left;
      }

      if (Math.abs(c.position.top - top) < 5) {
        horizontal = c.position.top;
      }
    });

    setGuides({ vertical, horizontal });
  };

  return (
    <div
      onMouseMove={(e) => {
        const drag = dragRef.current;
        if (!drag.id) return;

        const left = snap(e.clientX - drag.offsetX);
        const top = snap(e.clientY - drag.offsetY);

        detectGuides(drag.id, left, top);

        useBuilderStore
          .getState()
          .updateComponentPosition(drag.id, { left, top });
      }}
      onMouseUp={() => {
        setGuides({ vertical: null, horizontal: null });

        dragRef.current = {
          id: null,
          offsetX: 0,
          offsetY: 0,
        };

        resizeRef.current = {
          id: null,
          direction: null,
          startX: 0,
          startY: 0,
          startW: 0,
          startH: 0,
        };
      }}
    >
      {/* guides */}
      {guides.vertical !== null && (
        <div
          style={{
            position: "absolute",
            left: guides.vertical,
            top: 0,
            width: 1,
            height: "100%",
            background: "#22c55e",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        />
      )}

      {guides.horizontal !== null && (
        <div
          style={{
            position: "absolute",
            top: guides.horizontal,
            left: 0,
            width: "100%",
            height: 1,
            background: "#22c55e",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        />
      )}

      {/* components */}
      {activePage.components.map((comp) => (
        <div
          key={comp.id}
          onClick={(e) => {
            e.stopPropagation();

            const isMulti = e.shiftKey;

            if (isMulti) {
              const already = selectedComponentIds.includes(comp.id);

              const newSelection = already
                ? selectedComponentIds.filter((id) => id !== comp.id)
                : [...selectedComponentIds, comp.id];

              setSelectionIds(newSelection);
            } else {
              setSelection(comp.id);
            }
          }}
          style={{
            position: "absolute",
            left: comp.position.left,
            top: comp.position.top,
            width: comp.position.width,
            height: comp.position.height,
            background: "#1e293b",
            color: "#fff",
            border:
              comp.id === selectedComponentId
                ? "2px solid #6366f1"
                : "1px solid #334155",
          }}
        >
          {comp.content?.text || comp.name}
        </div>
      ))}
    </div>
  );
};

export default CanvasWorkspace;