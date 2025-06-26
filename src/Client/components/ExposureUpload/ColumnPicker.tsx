import React, { useState, useRef, useEffect } from "react";
import type { Table } from "@tanstack/table-core";
import { MoreVertical } from "lucide-react";

interface ColumnPickerProps<T> {
  table: Table<T>;
  defaultVisibleColumnIds: string[];
  excludeColumnIds?: string[]; // <-- New prop
}

export default function ColumnPicker<T>({
  table,
  defaultVisibleColumnIds,
  excludeColumnIds = [], // default to empty array
}: ColumnPickerProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (open && ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open]);

  const allCols = table.getAllLeafColumns();
  const allVisible = allCols.every((col) => col.getIsVisible());

  return (
    <div ref={ref} className="relative inline-block mb-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="ml-2 flex items-center space-x-1 bg-transparent px-2 py-1 rounded text-sm focus:outline-none hover:bg-gray-50"
      >
        <MoreVertical
          size={20}
          className={open ? "transform rotate-180" : ""}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-3 w-56 max-h-64 overflow-auto bg-white border rounded shadow-lg z-50">
          <div className="p-2 space-y-1">
            {/* Select All / Restore Defaults */}
            <label className="flex items-center space-x-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={allVisible}
                onChange={() => {
                  if (!allVisible) {
                    // Select all
                    allCols.forEach((col) => col.toggleVisibility(true));
                  } else {
                    // Restore defaults
                    allCols.forEach((col) =>
                      col.toggleVisibility(
                        defaultVisibleColumnIds.includes(col.id)
                      )
                    );
                  }
                }}
                className="form-checkbox"
              />
              <span>{allVisible ? "Restore Defaults" : "Select All"}</span>
            </label>
            <hr />

            {allCols
            
              .filter((col) => !excludeColumnIds.includes(col.id))
              .map((col) => {
                const h = col.columnDef.header;
                const label =
                  typeof h === "function"
                    ? h({ column: col, table } as any)
                    : (h as React.ReactNode);

                return (
                  <label
                    key={col.id}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={col.getIsVisible()}
                      onChange={() => col.toggleVisibility()}
                      className="form-checkbox"
                    />
                    <span>{label}</span>
                  </label>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}