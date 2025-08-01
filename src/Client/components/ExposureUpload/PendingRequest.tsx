"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { Draggable } from "../utils/Draggable";
import { Droppable } from "../utils/Droppable";
// import ColumnPicker from "../ExposureBucketComponents/ColumnPicker";
import ColumnPicker from "./ColumnPicker";
import { type SortingState } from "@tanstack/react-table";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  getPaginationRowModel,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import Button from "../ui/Button";

// Define the data type
interface ExposureRequest {
  id: string;
  refNo: string;
  type: string;
  bu: string;
  vendorBeneficiary: string;
  amount: number;
  currency: string;
  maturityExpiry: string;
  linkedId: string;
  status: string;
  checkerComments: string;
}

// Mock data
const mockData: ExposureRequest[] = [
  {
    id: "REQ-001",
    refNo: "EXP-1001",
    type: "LC",
    bu: "Finance",
    vendorBeneficiary: "Tata Steel Ltd",
    amount: 1200000,
    currency: "INR",
    maturityExpiry: "2025-10-15",
    linkedId: "LNK-301",
    status: "Pending",
    checkerComments: "",
  },
  {
    id: "REQ-002",
    refNo: "EXP-1002",
    type: "Guarantee",
    bu: "Logistics",
    vendorBeneficiary: "Maersk Global",
    amount: 450000,
    currency: "USD",
    maturityExpiry: "2025-12-01",
    linkedId: "LNK-302",
    status: "Approved",
    checkerComments: "Verified documents. Approved.",
  },
  {
    id: "REQ-003",
    refNo: "EXP-1003",
    type: "Loan",
    bu: "Procurement",
    vendorBeneficiary: "Hindustan Unilever",
    amount: 800000,
    currency: "EUR",
    maturityExpiry: "2026-03-20",
    linkedId: "LNK-303",
    status: "Rejected",
    checkerComments: "Missing vendor compliance form.",
  },
];

const PendingRequest: React.FC = () => {
  const [data] = useState<ExposureRequest[]>(mockData);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Separate state for filter values
  const [statusFilterValue, setStatusFilterValue] = useState("");
  const [buFilterValue, setBuFilterValue] = useState("");
  const [typeFilterValue, setTypeFilterValue] = useState("");
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  // State for applied filters
  const [statusFilter, setStatusFilter] = useState("");
  const [buFilter, setBuFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");

  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  useEffect(() => {
    if (data.length && columnOrder.length === 0) {
      const defaultOrder = [
        "select",
        "refNo",
        "type",
        "bu",
        "vendorBeneficiary",
        "amount",
        "currency",
        "maturityExpiry",
        "linkedId",
        "status",
        "checkerComments",
      ];
      setColumnOrder(defaultOrder);
    }
  }, [data, columnOrder.length]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const resetFilters = () => {
    setStatusFilter("");
    setBuFilter("");
    setTypeFilter("");
    setGlobalFilter("");
  };

  const columns = useMemo<ColumnDef<ExposureRequest>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
          />
        ),

        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
          />
        ),
        size: 50,
      },
      {
        accessorKey: "refNo",
        header: "Ref No",
        cell: ({ getValue }) => (
          <span className="font-medium text-gray-900">
            {getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ getValue }) => (
          <span className="text-gray-700">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "bu",
        header: "BU",
        cell: ({ getValue }) => (
          <span className="text-gray-700">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "vendorBeneficiary",
        header: "Vendor/Beneficiary",
        cell: ({ getValue }) => (
          <span className="text-gray-700">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-left font-medium"
          >
            Amount
            {{
              asc: "↑",
              desc: "↓",
            }[column.getIsSorted() as string] ?? "↕"}
          </button>
        ),
        enableSorting: true,
        sortingFn: (a, b, id) =>
          (a.getValue(id) as number) - (b.getValue(id) as number),
        cell: ({ getValue }) => (
          <span className="font-medium text-gray-900">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(getValue() as number)}
          </span>
        ),
      },
      {
        accessorKey: "currency",
        header: "Currency",
        cell: ({ getValue }) => (
          <span className="text-gray-700">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "maturityExpiry",
        header: "Maturity/Expiry",

        cell: ({ getValue }) => (
          <span className="text-gray-700">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "linkedId",
        header: "Linked ID",
        cell: ({ getValue }) => (
          <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
            {getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue() as string;
          const statusColors = {
            Pending: "bg-yellow-100 text-yellow-800",
            Approved: "bg-green-100 text-green-800",
            Rejected: "bg-red-100 text-red-800",
            "Under Review": "bg-blue-100 text-blue-800",
          };
          return (
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                statusColors[status as keyof typeof statusColors] ||
                "bg-gray-100 text-gray-800"
              }`}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: "checkerComments",
        header: "Checker Comments",
        cell: ({ row }) => {
          const initialValue = row.getValue("checkerComments");

          const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            row.getValue("checkerComments");
            row.original.checkerComments = e.target.value;
          };

          return (
            <input
              type="text"
              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-green-500 focus:ring-2"
              defaultValue={initialValue as string}
              onChange={onChange}
            />
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ActionDropdown row={row.original} />,
        size: 80,
      },
    ],
    []
  );
  const defaultVisibility: Record<string, boolean> = {
    select: true,
    refNo: true,
    type: true,
    bu: true,
    vendorBeneficiary: true,
    amount: true,
    currency: false,
    maturityExpiry: true,
    linkedId: false,
    status: true,
    checkerComments: false,
  };

  const [columnVisibility, setColumnVisibility] = useState(defaultVisibility);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      return (
        (!statusFilter ||
          row.status.toLowerCase() === statusFilter.toLowerCase()) &&
        (!buFilter || row.bu.toLowerCase() === buFilter.toLowerCase()) &&
        (!typeFilter || row.type.toLowerCase() === typeFilter.toLowerCase()) &&
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(globalFilter.toLowerCase())
        )
      );
    });
  }, [data, statusFilter, buFilter, typeFilter, globalFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    state: {
      pagination,
      columnOrder,
      columnVisibility,
      sorting,
      rowSelection,
    },
  });

  const applyFilters = () => {
    setStatusFilter(statusFilterValue);
    setBuFilter(buFilterValue);
    setTypeFilter(typeFilterValue);
    setGlobalFilter(globalFilterValue);
  };

  return (
    <div className="space-y-6">
      <h4 className="pb-2 border-b flex items-center justify-between text-lg font-semibold text-gray-800">
        Filter Exposure Request
      </h4>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={statusFilterValue}
            onChange={(e) => setStatusFilterValue(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Unit
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={buFilterValue}
            onChange={(e) => setBuFilterValue(e.target.value)}
          >
            <option value="">All BU</option>
            <option value="Finance">Finance</option>
            <option value="Logistics">Logistics</option>
            <option value="Procurement">Procurement</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type of Exposure
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={typeFilterValue}
            onChange={(e) => setTypeFilterValue(e.target.value)}
          >
            <option value="">All Exposure</option>
            <option value="LC">LC</option>
            <option value="Guarantee">Guarantee</option>
            <option value="Loan">Loan</option>
          </select>
        </div>

        <div className="flex items-end">
          <Button onClick={applyFilters}>
            <span className="text-white">Apply Filters</span>
          </Button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search..."
          value={globalFilterValue}
          onChange={(e) => setGlobalFilterValue(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex items-center justify-between w-full gap-2">
          <Button onClick={applyFilters}>
            <span className="text-white">Search</span>
          </Button>

          <Button color="Red" onClick={resetFilters}>
            <span className="text-white">Reset</span>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div
          // className="p-4 border-b flex items-center justify-between"
          className="flex items-center justify-between gap-2"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="mt-4">
              <ColumnPicker
                table={table}
                defaultVisibleColumnIds={[
                  "select",
                  "refNo",
                  "type",
                  "bu",
                  "vendorBeneficiary",
                  "amount",
                  "maturityExpiry",
                  "status",
                ]}
                excludeColumnIds={["select", "actions"]}
              />
            </div>
            <h4 className="text-lg font-semibold text-gray-800">
              Exposure Bucketing
            </h4>
          </div>

          <div className="flex gap-2">
            <Button color="Green" categories="Medium">
              Approve Selected
            </Button>

            <Button color="Red" categories="Medium">
              Reject Selected
            </Button>

            <Button color="Blue" categories="Medium">
              Save Draft Comments
            </Button>
          </div>
        </div>

        {/* Table */}

        <div className="w-full overflow-x-auto">
          <div className="min-w-full overflow-visible">
            <table className="min-w-full divide-y divide-gray-200">
              <DndContext
                onDragEnd={(event: DragEndEvent) => {
                  const { active, over } = event;
                  if (active.id !== over?.id) {
                    const oldIndex = columnOrder.indexOf(active.id as string);
                    const newIndex = columnOrder.indexOf(over?.id as string);
                    const newOrder = [...columnOrder];
                    newOrder.splice(oldIndex, 1);
                    newOrder.splice(newIndex, 0, active.id as string);
                    setColumnOrder(newOrder);
                  }
                }}
              >
                <colgroup>
                  {table.getVisibleLeafColumns().map((col) => {
                    const colId = col.id;

                    const colClass =
                      colId === "checkerComments"
                        ? "min-w-[190px]"
                        : "min-w-[150px]"; // default = no constraints

                    return <col key={colId} className={colClass} />;
                  })}
                </colgroup>

                <thead className="bg-gradient-to-b from-green-200 to-blue-100">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header, index) => {
                        const isFirst = index === 0;
                        const isLast = index === headerGroup.headers.length - 1;

                        return (
                          <th
                            key={header.id}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            style={{ width: header.getSize() }}
                          >
                            <Droppable id={header.column.id}>
                              {isFirst || isLast ? (
                                <div className="px-1">
                                  {/* Not draggable */}
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                                </div>
                              ) : (
                                <Draggable id={header.column.id}>
                                  <div className="cursor-move hover:bg-green-200 rounded px-1 transition duration-150 ease-in-out">
                                    {flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                                  </div>
                                </Draggable>
                              )}
                            </Droppable>
                          </th>
                        );
                      })}
                    </tr>
                  ))}
                </thead>
              </DndContext>

              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <p className="text-lg font-medium text-gray-900 mb-1">
                          No exposure requests found
                        </p>
                        <p className="text-sm text-gray-500">
                          There are no pending exposure requests at the moment.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 whitespace-nowrap text-sm"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Showing{" "}
                {table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  1}{" "}
                to{" "}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) *
                    table.getState().pagination.pageSize,
                  table.getCoreRowModel().rows.length
                )}{" "}
                of {table.getCoreRowModel().rows.length} results
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
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
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="px-3 py-1 text-sm text-gray-700">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </span>

                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                  className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionDropdown: React.FC<{ row: ExposureRequest }> = ({ row }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-8 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-[9999]">
          <div className="py-1">
            <button
              onClick={() => {
                console.log("View details for:", row.refNo);
                setIsOpen(false);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              View Details
            </button>
            <button
              onClick={() => {
                console.log("Edit:", row.refNo);
                setIsOpen(false);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-gray-100"
            >
              Edit
            </button>
            <button
              onClick={() => {
                console.log("Delete:", row.refNo);
                setIsOpen(false);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
            >
              Delete
            </button>
            <button
              onClick={() => {
                console.log("Cancel:", row.refNo);
                setIsOpen(false);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRequest;