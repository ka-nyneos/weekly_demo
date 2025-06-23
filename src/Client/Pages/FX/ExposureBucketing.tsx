// src/Client/Pages/ExposureBucketing.tsx
import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  getSortedRowModel,
  type SortingState,
  type ColumnDef,
  type ColumnFiltersState,
} from "@tanstack/react-table";

import Layout from "../../components/Layout/layout";
import EditableWithHistory from "../../components/ExposureBucketComponents/EditableWithHistory";
import ColumnPicker from "../../components/ExposureBucketComponents/ColumnPicker";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";


// --- constants & types ---
const exposureTypes = ["Purchase Order (PO)", "Letter of Credit (LC)"];
const incoTerms = ["FOB", "CIF", "EXW", "DDP"];
const businessUnits = ["BU1", "BU2"];
const currencies = ["INR", "EUR", "USD"];
const payableReceivable = ["Payable", "Receivable"];

type POData = {
  poNumber: string;
  client: string;
  type: string;
  bu: string;
  details: string;
  date: string;
  currency: string;
  amount: number;
  advance: number;
  inco: string;
  m1: number;
  m2: number;
  m3: number;
  m4to6: number;
  m6p: number;
  remarks: string;
};

const defaultPOData: POData[] = [
  {
    poNumber: "PO12101",
    client: "Vendor A",
    type: "Payable",
    bu: "BU1",
    details: "PO Ref ABC123",
    date: "2025-07-15",
    currency: "USD",
    amount: 10000,
    advance: 0,
    inco: "FOB",
    m1: 100,
    m2: 2000,
    m3: 0,
    m4to6: 3000,
    m6p: 350,
    remarks: "",
  },
  {
    poNumber: "PO12102",
    client: "Vendor B",
    type: "Receivable",
    bu: "BU2",
    details: "PO Ref XYZ456",
    date: "2025-08-01",
    currency: "EUR",
    amount: 8000,
    advance: 0,
    inco: "CIF",
    m1: 0,
    m2: 1500,
    m3: 0,
    m4to6: 2500,
    m6p: 2000,
    remarks: "New vendor",
  },
  {
    poNumber: "PO12103",
    client: "Vendor C",
    type: "Payable",
    bu: "BU2",
    details: "Raw Material PO",
    date: "2025-07-20",
    currency: "INR",
    amount: 15000,
    advance: 1000,
    inco: "EXW",
    m1: 3000,
    m2: 3000,
    m3: 4000,
    m4to6: 0,
    m6p: 3000,
    remarks: "",
  },
  {
    poNumber: "PO12104",
    client: "Vendor D",
    type: "Receivable",
    bu: "BU1",
    details: "Service PO",
    date: "2025-08-12",
    currency: "USD",
    amount: 12000,
    advance: 0,
    inco: "DDP",
    m1: 1000,
    m2: 2000,
    m3: 1000,
    m4to6: 0,
    m6p: 0,
    remarks: "",
  },
  {
    poNumber: "PO12105",
    client: "Vendor E",
    type: "Payable",
    bu: "BU2",
    details: "Consulting PO",
    date: "2025-09-01",
    currency: "EUR",
    amount: 9500,
    advance: 500,
    inco: "FOB",
    m1: 500,
    m2: 0,
    m3: 0,
    m4to6: 250,
    m6p: 1000,
    remarks: "",
  },
];

function SortableHeader({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: "grab",
      }}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}

export default function ExposureBucketing() {
  const [exposureType, setExposureType] = useState(exposureTypes[0]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [effectiveDate, setEffectiveDate] = useState("2025-05-22");
  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  const [sorting, setSorting] = useState<SortingState>([]);

  const defaultVisibility: Record<string, boolean> = {
    poNumber: true,
    client: true,
    type: true,
    bu: true,
    amount: true,
    remainingPct: true,
    details: true,
    date: true,
    currency: true,
    advance: true,
    inco: false,
    m1: false,
    m2: false,
    m3: false,
    m4to6: false,
    m6p: false,
    remarks: false,
  };
  const [columnVisibility, setColumnVisibility] = useState(defaultVisibility);

  const [poData, setPoData] = useState<POData[]>(defaultPOData);
  const [originalData, setOriginalData] = useState<POData[]>(defaultPOData);
  const [openCell, setOpenCell] = useState<{row: number; key: keyof POData} | null>(null);

  const [bgColor, setBgColor] = useState("bg-white-400");

  // handle inline edits
  const handlePOInputChange = useCallback(
    (rowIdx: number, key: keyof POData, raw: string) => {
      // Only for numeric fields (advance, m1…m6p)
      const numericKeys: (keyof POData)[] = [
        "advance",
        "m1",
        "m2",
        "m3",
        "m4to6",
        "m6p",
      ];

      let newRaw: string = raw;
      let parsed =
        key !== "inco" && key !== "remarks" ? parseFloat(raw) || 0 : raw;

      if (numericKeys.includes(key)) {
        setPoData((prev) => {
          const next = [...prev];
          const row = { ...next[rowIdx] };
          const amount = row.amount;

          // sum of allocations *excluding* the field being edited
          const sumOthers = numericKeys.reduce((sum, k) => {
            return sum + (k === key ? 0 : (row[k] as number));
          }, 0);

          const maxAlloc = amount - sumOthers;

          // if user tries to exceed
          if (parsed > maxAlloc) {
            alert(
              `Cannot allocate more than ₹${maxAlloc.toLocaleString()}. You entered ${parsed.toLocaleString()}.`
            );
            parsed = maxAlloc;
          }
          if (parsed < 0) {
            parsed = 0;
          }

          row[key] = parsed as any;
          next[rowIdx] = row;
          return next;
        });
        return;
      }

      // non-numeric (inco / remarks)
      setPoData((prev) => {
        const next = [...prev];
        next[rowIdx] = { ...next[rowIdx], [key]: newRaw };
        return next;
      });
    },
    []
  );

  const handleReset = () => {
    setPoData(defaultPOData);
    setOriginalData(defaultPOData);
    setColumnFilters([]);
    setEffectiveDate("2025-05-22");
  };

  // build columns with inline highlight
  const poColumns = useMemo<ColumnDef<POData>[]>(() => {
    const base: ColumnDef<POData>[] = [
      {
        accessorKey: "poNumber",
        header: () => <span className="font-semibold">PO Number</span>,
      },
      {
        accessorKey: "client",
        header: () => <span className="font-semibold">Client / Vendor</span>,
      },
      {
        accessorKey: "type",
        header: () => (
          <span className="font-semibold">Payable / Receivable</span>
        ),
      },
      {
        accessorKey: "bu",
        header: () => <span className="font-semibold">BU</span>,
      },
      {
        accessorKey: "details",
        header: () => <span className="font-semibold">PO Details</span>,
      },
      {
        accessorKey: "date",
        header: () => <span className="font-semibold">PO Maturity Date</span>,
      },
      {
        accessorKey: "currency",
        header: () => <span className="font-semibold">Currency</span>,
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full h-full flex items-center justify-center gap-1"
          >
            PO Amount
            {{
              asc: "↑",
              desc: "↓",
            }[column.getIsSorted() as string] ?? "↕"}
          </button>
        ),
        enableSorting: true,
        sortingFn: (a, b, id) =>
          (a.getValue(id) as number) - (b.getValue(id) as number),
      },
      {
        accessorKey: "advance",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full h-full flex items-center justify-center gap-1"
          >
            Advance Given / Received
            {{
              asc: "↑",
              desc: "↓",
            }[column.getIsSorted() as string] ?? "↕"}
          </button>
        ),
        enableSorting: true,
        sortingFn: (a, b, id) =>
          (a.getValue(id) as number) - (b.getValue(id) as number),
        cell: ({ row }) => (
          <EditableWithHistory<POData>
            rowIdx={row.index}
            field="advance"
            value={row.original.advance}
            original={originalData[row.index].advance}
            onChange={(v) => handlePOInputChange(row.index, "advance", v)}
            openCell={openCell}
            setOpenCell={setOpenCell}
          />
        ),
      },

      {
        accessorKey: "inco",
        header: () => <span className="font-semibold whitespace-nowrap">INCO Term</span>,
        cell: ({ row }) => (
          <EditableWithHistory<POData>
            rowIdx={row.index}
            field="inco"
            value={row.original.inco}
            original={originalData[row.index].inco}
            onChange={(v) => handlePOInputChange(row.index, "inco", v)}
            openCell={openCell}
            setOpenCell={setOpenCell}
            options={incoTerms}
          />
        ),
      },
    ];

    const months = [
      { key: "m1", label: "Month 1" },
      { key: "m2", label: "Month 2" },
      { key: "m3", label: "Month 3" },
      { key: "m4to6", label: "Month 4 to 6" },
      { key: "m6p", label: "> 6 Months" },
    ].map(({ key, label }) => ({
      accessorKey: key,
      header: () => <span className="font-semibold">{label}</span>,
      cell: ({ row }) => (
        <EditableWithHistory<POData>
          rowIdx={row.index}
          field={key}
          value={row.original[key as keyof POData]}
          original={originalData[row.index][key as keyof POData]}
          onChange={(v) => handlePOInputChange(row.index, key, v)}
          openCell={openCell}
          setOpenCell={setOpenCell}
        />
      ),
    }));
    const percentageCol: ColumnDef<POData> = {
      accessorKey: "remainingPct",
      id: "remainingPct",
      header: () => <span className="font-semibold">Remaining %</span>,
      cell: ({ row }) => {
        const { amount, advance, m1, m2, m3, m4to6, m6p } = row.original;
        const allocated = advance + m1 + m2 + m3 + m4to6 + m6p;
        const remaining = Math.max(amount - allocated, 0);
        const pct = amount > 0 ? (remaining / amount) * 100 : 0;
        // hue: 0 (red) when pct=100, 120 (green) when pct=0
        const hue = (1 - pct / 100) * 120;
        const bg = `hsl(${hue}, 100%, 50%)`;
        return (
          <div
            style={{
              backgroundColor: bg,
              padding: "0.25rem",
              borderRadius: "0.375rem",
            }}
          >
            {pct.toFixed(1)}%
          </div>
        );
      },
    };

    const remarksCol: ColumnDef<POData> = {
      accessorKey: "remarks",
      header: () => <span className="font-semibold">Remarks</span>,
      cell: ({ row }) => (
        <EditableWithHistory<POData>
          rowIdx={row.index}
          field="remarks"
          value={row.original.remarks}
          original={originalData[row.index].remarks}
          onChange={(v) => handlePOInputChange(row.index, "remarks", v)}
          openCell={openCell}
          setOpenCell={setOpenCell}
        />
      ),
    };

    return [...base, ...months, percentageCol, remarksCol];
  },[handlePOInputChange, originalData, openCell]);

  // init column order
  useEffect(() => {
    if (poColumns.length && !columnOrder.length) {
      setColumnOrder(poColumns.map((c) => c.accessorKey as string));
    }
  }, [poColumns, columnOrder]);






  const table = useReactTable({
    data: poData,
    columns: poColumns,
    state: { columnFilters, columnOrder ,columnVisibility,sorting,},
    onColumnFiltersChange: setColumnFilters,
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange:setColumnVisibility,

    onSortingChange: setSorting,


    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    getSortedRowModel: getSortedRowModel(),

    
  });

  const setFilter = (id: string, value: string) =>
    setColumnFilters((prev) => [
      ...prev.filter((f) => f.id !== id),
      ...(value ? [{ id, value }] : []),
    ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  return (
    <Layout
        title="Exposure Bucketing Table"
        
        >
        {/* filters */}
        <div className="flex items-center gap-2 mb-4">
          <label className="font-semibold">Columns Picker:</label>
          <ColumnPicker table={table} />
        </div>
        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <label className="font-semibold">Exposure Type:</label>
            <select
              className="ml-2 border px-2 py-1 rounded"
              value={exposureType}
              onChange={(e) => setExposureType(e.target.value)}
            >
              {exposureTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-semibold">Business Unit:</label>
            <select
              className="ml-2 border px-2 py-1 rounded"
              onChange={(e) => setFilter("bu", e.target.value)}
            >
              <option value="">All</option>
              {businessUnits.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-semibold">Currency:</label>
            <select
              className="ml-2 border px-2 py-1 rounded"
              onChange={(e) => setFilter("currency", e.target.value)}
            >
              <option value="">All</option>
              {currencies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-semibold">Payable / Receivable:</label>
            <select
              className="ml-2 border px-2 py-1 rounded"
              onChange={(e) => setFilter("type", e.target.value)}
            >
              <option value="">All</option>
              {payableReceivable.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-semibold">Effective Date:</label>
            <input
              type="date"
              className="ml-2 border px-2 py-1 rounded"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Search Vendor/Beneficiary:</label>
            <input
              type="text"
              onChange={(e) => setFilter("client", e.target.value)}
              className="border px-2 py-1 rounded"
              placeholder="Enter name"
            />
          </div>
        </div>

        {/* table */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={({ active, over }) => {
            if (!over || active.id === over.id) return;
            const oldI = columnOrder.indexOf(active.id as string);
            const newI = columnOrder.indexOf(over.id as string);
            setColumnOrder(arrayMove(columnOrder, oldI, newI));
          }}
        >
          <SortableContext
            items={columnOrder}
            strategy={verticalListSortingStrategy}
          >
            <div className="overflow-x-auto w-full">
              <table className="table-fixed w-max border border-collapse rounded-lg shadow-sm text-sm">
                {/* <table className="table-fixed min-w-[1200px] border …"> */}

                <colgroup>
                  {table.getVisibleLeafColumns().map(col => (
                    <col key={col.id} className="w-[150px]" />
                  ))}
                </colgroup>
                <thead className="bg-gradient-to-b from-green-200   to-blue-100 text-md text-black hover:bg-blue-300">
                  {table.getHeaderGroups().map((hg) => (
                    <tr key={hg.id}>
                      {hg.headers.map((h) => (
                        <th
                          key={h.id}
                          className="p-3 text-center border border-gray-300 font-semibold cursor-move rounded transition duration-150 ease-in-out group"
                        >
                          <SortableHeader id={h.column.id}>
                            {/* inline-block so bg only wraps text */}
                            <span className="inline-block px-1 rounded group-hover:bg-green-200">
                              {flexRender(
                                h.column.columnDef.header,
                                h.getContext()
                              )}
                            </span>
                          </SortableHeader>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-green-50 transition">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="border p-2 text-center">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SortableContext>
        </DndContext>

        {/* actions */}
        <div className="flex justify-center mt-6 gap-4 flex-wrap">
          <button
            onClick={() => alert("Bucketing Saved")}
            className="px-4 py-2 bg-[#00674b] text-white rounded-lg hover:bg-green-700"
          >
            Save
          </button>
          <button
            onClick={handleReset}
            className="print bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Reset
          </button>
          <button
            onClick={() => window.print()}
            className="print bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Print
          </button>
          <button className="print bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
            Cancel
          </button>
          <button className="print bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
            Clear Data
          </button>
        </div>
      
    </Layout>
  );
}
