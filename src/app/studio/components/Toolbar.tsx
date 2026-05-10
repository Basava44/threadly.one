"use client";

import { useEditorStore, ToolType } from "../store/useEditorStore";
import {
  MousePointer2,
  Type,
  Square,
  Circle,
  Triangle,
  Undo2,
  Redo2,
  Trash2,
  Copy,
} from "lucide-react";

interface ToolbarProps {
  onAddText: () => void;
  onAddShape: (type: "rect" | "circle" | "triangle") => void;
  onUndo: () => void;
  onRedo: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export default function Toolbar({
  onAddText,
  onAddShape,
  onUndo,
  onRedo,
  onDelete,
  onDuplicate,
  canUndo,
  canRedo,
}: ToolbarProps) {
  const { activeTool, setTool } = useEditorStore();

  const handleToolClick = (tool: ToolType) => {
    setTool(tool);
    if (tool === "text") onAddText();
  };

  return (
    <div className="w-14 border-r border-foreground/10 bg-white/50 backdrop-blur-sm flex flex-col items-center py-3 gap-1 shrink-0">
      {/* Select tool */}
      <ToolButton
        active={activeTool === "select"}
        onClick={() => setTool("select")}
        title="Select (V)"
        icon={<MousePointer2 size={18} />}
      />

      {/* Text tool */}
      <ToolButton
        active={activeTool === "text"}
        onClick={() => handleToolClick("text")}
        title="Add Text (T)"
        icon={<Type size={18} />}
      />

      {/* Shape tool */}
      <ToolButton
        active={activeTool === "shape"}
        onClick={() => setTool("shape")}
        title="Shapes"
        icon={<Square size={18} />}
      />

      {/* Shape sub-tools */}
      {activeTool === "shape" && (
        <>
          <div className="w-6 h-px bg-foreground/10 my-1" />
          <ToolButton onClick={() => onAddShape("rect")} title="Rectangle" icon={<Square size={14} />} />
          <ToolButton onClick={() => onAddShape("circle")} title="Circle" icon={<Circle size={14} />} />
          <ToolButton onClick={() => onAddShape("triangle")} title="Triangle" icon={<Triangle size={14} />} />
        </>
      )}

      <div className="w-6 h-px bg-foreground/10 my-2" />

      {/* Undo/Redo */}
      <ToolButton onClick={onUndo} title="Undo (Ctrl+Z)" icon={<Undo2 size={16} />} disabled={!canUndo} />
      <ToolButton onClick={onRedo} title="Redo (Ctrl+Shift+Z)" icon={<Redo2 size={16} />} disabled={!canRedo} />

      <div className="w-6 h-px bg-foreground/10 my-2" />

      {/* Actions */}
      <ToolButton onClick={onDuplicate} title="Duplicate (Ctrl+D)" icon={<Copy size={16} />} />
      <ToolButton onClick={onDelete} title="Delete" icon={<Trash2 size={16} />} danger />
    </div>
  );
}

function ToolButton({
  active,
  onClick,
  title,
  icon,
  disabled,
  danger,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  icon: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
        active
          ? "bg-foreground text-cream shadow-sm"
          : disabled
          ? "text-foreground/20 cursor-not-allowed"
          : danger
          ? "hover:bg-red-50 text-red-500/70"
          : "hover:bg-foreground/5 text-foreground/70"
      }`}
      title={title}
    >
      {icon}
    </button>
  );
}
