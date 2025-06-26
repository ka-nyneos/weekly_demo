import { MoreVertical } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

interface ColumnOption {
  key: string;
  label: string;
}

interface TableHeaderProps {
  colDropdownOpen: boolean;
  setColDropdownOpen: (open: boolean) => void;
  colDropdownRef: React.RefObject<HTMLDivElement>;
  COLUMN_OPTIONS: ColumnOption[];
  visibleColumns: string[];
  setVisibleColumns: React.Dispatch<React.SetStateAction<string[]>>;
  children: React.ReactNode;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  colDropdownOpen,
  setColDropdownOpen,
  colDropdownRef,
  COLUMN_OPTIONS,
  visibleColumns,
  setVisibleColumns,
  children,
}) => {
  // Ref for the select all checkbox
  const selectAllRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = visibleColumns.length > 0 && visibleColumns.length < COLUMN_OPTIONS.length;
    }
  }, [visibleColumns, COLUMN_OPTIONS.length]);

  // Default visible columns (should match the default in the main table component)
  const defaultVisibleColumnIds = React.useMemo(() => [
    "bu", "bank", "currency", "poNo", "vendor", "exposureAmt", "bookingDate", "fxMaturityDate", "requestId", "status", "contractNoteStatus", "actionType"
  ], []);

  return (
    <div className="bg-[#fff] border border-[#d8e6e5] rounded-xl shadow mb-8 m-2">
      <div className="font-semibold text-gray-800 border-[#d8e6e5] px-6 py-4 flex items-center justify-between text-lg relative">
        <div className="flex items-center gap-2 ">
          {/* Column Visibility Kebab Menu (left of heading) */}
          <button
            type="button"
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-200 focus:outline-none border border-gray-300 shadow-sm mr-2"
            onClick={() => setColDropdownOpen(!colDropdownOpen)}
            tabIndex={0}
            aria-haspopup="true"
            aria-expanded={colDropdownOpen}
          >
            <span className="sr-only">Column options</span>
            <MoreVertical size={20} />
          </button>
          <span className="fa fa-list" />
          <span className="text-2xl font-bold text-gray-800 tracking-wide">All FX Booking Requests</span>
        </div>
        {/* Print/Export buttons right of heading, on same line */}
        <div className="flex gap-2">
          {children && Array.isArray(children) ? children[0] : null}
        </div>
        {/* Dropdown for column visibility */}
        {colDropdownOpen && (
          <div
            ref={colDropdownRef}
            className="absolute left-0 top-12 min-w-[220px] rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-50 animate-fade-in border border-gray-200 p-3"
          >
            <div className="font-semibold text-gray-700 mb-2 text-sm">Show/Hide Columns</div>
            <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
              <label className="flex items-center gap-2 px-2 py-1 rounded hover:bg-green-50 cursor-pointer text-sm font-semibold">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={visibleColumns.length === COLUMN_OPTIONS.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      // Select all columns
                      setVisibleColumns(COLUMN_OPTIONS.map((col) => col.key));
                    } else {
                      // Restore default columns
                      setVisibleColumns(defaultVisibleColumnIds);
                    }
                  }}
                  className="accent-[#035a51]"
                />
                <span>{visibleColumns.length === COLUMN_OPTIONS.length ? 'Restore Default' : 'Select All'}</span>
              </label>
              {COLUMN_OPTIONS.map((col) => (
                <label key={col.key} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-green-50 cursor-pointer text-sm">
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
                    className="accent-[#035a51]"
                  />
                  <span>{col.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="p-0">
        {children && Array.isArray(children) ? children[1] : children}
      </div>
      {/* Pagination controls below the table */}
      {children && Array.isArray(children) && children[2]}
    </div>
  );
};

export default TableHeader;