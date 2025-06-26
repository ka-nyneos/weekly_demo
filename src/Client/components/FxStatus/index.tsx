// FXBookingStatusDashboard is the main dashboard page for viewing and managing FX Booking requests.
// It provides filtering, searching, column visibility, column reordering, and table actions (print/export).

import { closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Button from '../../components/ui/Button';
import Layout from "../Layout/layout";
import FXBookingFilters from "./FXBookingFilters";
import FXBookingTable from "./FXBookingTable";
import TableHeader from "./TableHeader";
import { fetchBookingData } from "./data";
import getColumns from "./getColumns";
import type { FXBooking } from "./types";

const FXBookingStatusDashboard = () => {
  // State for editing comments in the table
  const [editingCommentRow, setEditingCommentRow] = useState<string | null>(null);
  const [editingCommentValue, setEditingCommentValue] = useState<string>("");
  // Save handler for comments
  const handleCommentSave = (rowId: string) => {
    setData((prev) =>
      prev.map((row, idx) =>
        String(idx) === rowId ? { ...row, comments: editingCommentValue } : row
      )
    );
    setEditingCommentRow(null);
    setEditingCommentValue("");
  };

  // Main table data and column state
  const [data, setData] = useState<FXBooking[]>([]);
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  // Controls the order of columns in the table
  const [columnOrder, setColumnOrder] = useState<string[]>([
    "bu", "bank", "currency", "poNo", "vendor", "exposureAmt", "bookingDate", "fxMaturityDate", "requestId", "bankRefNo", "status", "contractNoteStatus", "amendmentStatus", "bookingCharges", "comments", "actionType"
  ]);
  const tableRef = useRef<HTMLTableElement>(null!);
  const [columnResizeMode] = useState<"onChange" | "onEnd">("onChange");

  // Fetch booking data on mount
  useEffect(() => {
    fetchBookingData().then(setData);
  }, []);

  // --- FILTER STATE MANAGEMENT ---
  // State for filter UI and logic
  const [pendingFilters, setPendingFilters] = useState({
    bu: "",
    bank: "",
    currency: "",
    status: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    bu: "",
    bank: "",
    currency: "",
    status: "",
  });
  const [searchInput, setSearchInput] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const searchTimeout = useRef<number | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedSuggestion, setHighlightedSuggestion] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null!);

  // Compute unique filter options for dropdowns
  const buOptions = useMemo(() =>
    Array.from(new Set(data.map((d) => d.bu))).sort((a, b) => a.localeCompare(b)), [data]
  );
  const bankOptions = useMemo(() =>
    Array.from(new Set(data.map((d) => d.bank))).sort((a, b) => a.localeCompare(b)), [data]
  );
  const currencyOptions = useMemo(() =>
    Array.from(new Set(data.map((d) => d.currency))).sort((a, b) => a.localeCompare(b)), [data]
  );
  const statusOptions = useMemo(() =>
    Array.from(new Set(data.map((d) => d.status))).sort((a, b) => a.localeCompare(b)), [data]
  );

  // Compute global search suggestions from all table data
  const searchSuggestions = useMemo(() => {
    if (!searchInput) return [];
    const lower = searchInput.toLowerCase();
    const allValues = data.flatMap((row) => Object.values(row).map((v) => String(v)));
    const unique = Array.from(new Set(allValues.filter((v) => v.toLowerCase().includes(lower))));
    return unique.sort((a, b) => a.localeCompare(b)).slice(0, 50);
  }, [searchInput, data]);

  // Debounced global search
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = window.setTimeout(() => {
      setGlobalSearch(searchInput);
    }, 400);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchInput]);

  // Handlers for search suggestion dropdown
  const handleSuggestionClick = (suggestion: string) => {
    setSearchInput(suggestion);
    setShowSuggestions(false);
    setGlobalSearch(suggestion);
    if (searchInputRef.current) searchInputRef.current.blur();
  };
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || searchSuggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      setHighlightedSuggestion((prev) => Math.min(prev + 1, searchSuggestions.length - 1));
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setHighlightedSuggestion((prev) => Math.max(prev - 1, 0));
      e.preventDefault();
    } else if (e.key === "Enter" && highlightedSuggestion >= 0) {
      handleSuggestionClick(searchSuggestions[highlightedSuggestion]);
      e.preventDefault();
    }
  };
  const handleSearchBlur = () => {
    setTimeout(() => setShowSuggestions(false), 100);
  };

  // Filter data based on applied filters and global search
  const filteredData = useMemo(() => {
    let result = data;
    Object.entries(appliedFilters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((row) =>
          String(row[key as keyof FXBooking])
            .toLowerCase()
            .includes(String(value).toLowerCase())
        );
      }
    });
    if (globalSearch) {
      const search = globalSearch.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((v) =>
          String(v).toLowerCase().includes(search)
        )
      );
    }
    return result;
  }, [data, appliedFilters, globalSearch]);

  // Sync applied filters to table state
  useEffect(() => {
    setColumnFilters(
      Object.entries(appliedFilters)
        .filter(([_, v]) => v)
        .map(([id, value]) => ({ id, value }))
    );
  }, [appliedFilters]);

  // --- COLUMN VISIBILITY & DROPDOWN STATE ---
  // Controls which columns are visible and the kebab menu state
  const COLUMN_OPTIONS = [
    { key: "bu", label: "BU" },
    { key: "bank", label: "Bank" },
    { key: "currency", label: "Currency" },
    { key: "poNo", label: "PO No" },
    { key: "vendor", label: "Vendor" },
    { key: "exposureAmt", label: "Exposure Amt" },
    { key: "bookingDate", label: "Booking Date" },
    { key: "fxMaturityDate", label: "FX Maturity Date" },
    { key: "requestId", label: "Request ID" },
    { key: "bankRefNo", label: "Bank Ref No." },
    { key: "status", label: "Status" },
    { key: "contractNoteStatus", label: "Contract Note Status" },
    { key: "amendmentStatus", label: "Amendment Status" },
    { key: "bookingCharges", label: "Booking Charges" },
    { key: "comments", label: "Comments" },
    { key: "actionType", label: "Action" },
  ];
  const DEFAULT_HIDDEN = ["bankRefNo", "bookingCharges", "comments", "amendmentStatus"];
  // Only columns not in DEFAULT_HIDDEN are visible by default
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    COLUMN_OPTIONS.filter((col) => !DEFAULT_HIDDEN.includes(col.key)).map((col) => col.key)
  );
  const [colDropdownOpen, setColDropdownOpen] = useState(false);
  const colDropdownRef = useRef<HTMLDivElement>(null!);

  // --- TABLE INSTANCE ---
  // Pagination and sorting state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([]);

  // useReactTable manages the table logic, columns, and state
  const table = useReactTable({
    data: filteredData,
    columns: getColumns(
      columnOrder.filter((col) => visibleColumns.includes(col)),
      editingCommentRow,
      editingCommentValue,
      setEditingCommentRow,
      setEditingCommentValue,
      handleCommentSave
    ),
    state: { columnFilters, columnOrder, pagination, sorting },
    onColumnFiltersChange: setColumnFilters,
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableColumnResizing: true,
    columnResizeMode,
  });

  // DnD-kit sensors for column drag-and-drop
  const sensors = useSensors(useSensor(PointerSensor));

  // Print and export handlers
  const handlePrint = () => window.print();
  const handleExport = () => {
    // Export all columns (except actionType), not just visible ones
    const headers = COLUMN_OPTIONS
      .map((c) => c.key)
      .filter((h) => h !== "actionType");
    const rows = data.map((row) =>
      headers.map((h) => row[h as keyof FXBooking])
    );
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "FX_Booking_Status.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Compose the page using the new components ---
  return (
    <Layout title="FX Booking Status Dashboard" showButton={false} >
        <div className="py-4  mb9-6 bg-slate-700">
        {/* Back to Dashboard */}
        {/* <div className="flex justify-start mb-4 print:hidden">
          <Button color="Blue" categories="Medium" 
          className="flex items-center gap-2 border border-[#d8e6e5] text-[#555] px-4 py-2 rounded-lg font-medium hover:bg-[#e6f4f3] hover:text-[#00564e] hover:border-[#00564e] transition"
          >
            <ArrowLeftCircle size={20} /> Back to Dashboard
          </Button>
        </div> */}
        {/* <h2 className="text-3xl font-bold text-center mb-8 text-[#00564e] tracking-wide">
          Detailed FX Booking View
        </h2> */}
      {/* Filters section for searching and filtering table data */}
      <FXBookingFilters
        pendingFilters={pendingFilters}
        setPendingFilters={setPendingFilters}
        buOptions={buOptions}
        bankOptions={bankOptions}
        currencyOptions={currencyOptions}
        statusOptions={statusOptions}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
        highlightedSuggestion={highlightedSuggestion}
        setHighlightedSuggestion={setHighlightedSuggestion}
        searchInputRef={searchInputRef}
        searchSuggestions={searchSuggestions}
        handleSuggestionClick={handleSuggestionClick}
        handleSearchKeyDown={handleSearchKeyDown}
        handleSearchBlur={handleSearchBlur}
        setAppliedFilters={setAppliedFilters}
        handleResetFilters={() => {
          setPendingFilters({ bu: "", bank: "", currency: "", status: "" });
          setAppliedFilters({ bu: "", bank: "", currency: "", status: "" });
          setSearchInput("");
          setGlobalSearch("");
        }}
      />
      {/* TableHeader wraps the table and provides column visibility controls */}
      <TableHeader
        colDropdownOpen={colDropdownOpen}
        setColDropdownOpen={setColDropdownOpen}
        colDropdownRef={colDropdownRef}
        COLUMN_OPTIONS={COLUMN_OPTIONS}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
      >
        {/* Print/Export buttons at top left */}
        <div className="flex gap-2 mb-2">
          <Button color="Blue" categories="Medium" onClick={handlePrint}>
            <span className="fa fa-print" /> Print Table
          </Button>
          <Button color="Green" categories="Medium" onClick={handleExport}>
            <span className="fa fa-file-export" /> Export as CSV
          </Button>
        </div>
        {/* FXBookingTable renders the main table with drag-and-drop and column visibility */}
        <FXBookingTable
          table={table}
          tableRef={tableRef}
          sensors={sensors}
          columnOrder={columnOrder.filter((col) => visibleColumns.includes(col))}
          setColumnOrder={(order: string[]) => setColumnOrder(order)}
          arrayMove={arrayMove}
          closestCenter={closestCenter}
        />
        {/* Pagination controls below the table */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">
              {(() => {
                const pageIndex = table.getState().pagination?.pageIndex || 0;
                const pageSize = table.getState().pagination?.pageSize || 10;
                const totalRows = table.getRowModel().rows.length;
                const start = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
                const end = Math.min((pageIndex + 1) * pageSize, totalRows);
                return `Showing ${start} to ${end} of ${totalRows} results`;
              })()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={table.getState().pagination?.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {'<<'}
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {'<'}
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Page {table.getState().pagination?.pageIndex + 1} of {table.getPageCount()}
              </span>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {'>'}
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {'>>'}
              </button>
            </div>
          </div>
        </div>
      </TableHeader>
    </div>
  </Layout>
  );
};

export default FXBookingStatusDashboard;
