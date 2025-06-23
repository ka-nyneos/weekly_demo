// src/components/ColumnPicker.tsx
import React, { useState, useRef, useEffect } from "react";
import type { Table } from "@tanstack/table-core";
import { ChevronDown } from "lucide-react";

interface ColumnPickerProps<T> {
  table: Table<T>;
}

export default function ColumnPicker<T>({ table }: ColumnPickerProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 1) click-outside to close
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (open && ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open]);

  // 2) define your “always-on” defaults here:
  const defaultVisibleColumnIds = [
    "poNumber",
    "client",
    "type",
    "bu",
    "amount",
    "remainingPct",
    "details",
    "date",
    "currency",
    "advance",
  ];

  const allCols = table.getAllLeafColumns();
  const allVisible = allCols.every((col) => col.getIsVisible());

  return (
    <div ref={ref} className="relative inline-block mb-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="
          ml-2 flex items-center space-x-1
          border border-gray-300 bg-white px-2 py-1 rounded text-sm
          focus:outline-none focus:ring focus:ring-blue-200 hover:bg-gray-50
        "
      >
        <span>Columns</span>
        <ChevronDown
          size={20}
          className={open ? "transform rotate-180" : ""}
        />
      </button>

      {open && (
        <div
          className="
            absolute left-0 top-full mt-1
            w-56 max-h-64 overflow-auto
            bg-white border rounded shadow-lg z-50
          "
        >
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
              <span>
                {allVisible ? "Restore Defaults" : "Select All"}
              </span>
            </label>
            <hr />

            {/* individual toggles */}
            {allCols.map((col) => {
              const h = col.columnDef.header;
              const label = (() => {
                if (typeof h === "function") {
                  return h({ column: col, table } as any);
                }
                return h as React.ReactNode;
              })();

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
