import React from "react";

interface ColumnVisibilityItemProps {
  col: { key: string; label: string };
  visibleColumns: string[];
  setVisibleColumns: React.Dispatch<React.SetStateAction<string[]>>;
  attributes: any;
  listeners: any;
  setNodeRef: (node: HTMLElement | null) => void;
  transform: any;
  transition: string | undefined;
  isDragging: boolean;
}

const ColumnVisibilityItem: React.FC<ColumnVisibilityItemProps> = ({
  col,
  visibleColumns,
  setVisibleColumns,
  attributes,
  listeners,
  setNodeRef,
  transform,
  transition,
  isDragging,
}) => (
  <div
    key={col.key}
    ref={setNodeRef}
    style={{
      transform,
      transition,
      opacity: isDragging ? 0.5 : 1,
      background: isDragging ? '#e6f4f3' : undefined,
    }}
    className="flex items-center gap-2 px-2 py-1 rounded hover:bg-green-50 cursor-pointer text-sm select-none"
    {...attributes}
    {...listeners}
  >
    <span className="cursor-move text-gray-400 mr-1" title="Drag to reorder">≡</span>
    <input
      type="checkbox"
      checked={visibleColumns.includes(col.key)}
      onChange={() => {
        setVisibleColumns((prev) =>
          prev.includes(col.key)
            ? prev.filter((k) => k !== col.key)
            : [...prev, col.key]
        );
      }}
      className="accent-[#00564e]"
    />
    <span>{col.label}</span>
  </div>
);

export default ColumnVisibilityItem;
