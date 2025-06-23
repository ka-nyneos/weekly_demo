"use client";

import React, { useState, useMemo, useEffect } from "react";
import Button from "../ui/Button";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
// import {
//   SortableContext,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
import { Draggable } from "../utils/Draggable";
import { Droppable } from "../utils/Droppable";

import {
  useReactTable,
  getCoreRowModel,
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
  detail: string;
  status: string;
  UploadBy: string;
  UploadDate: string;
}

const mockData: ExposureRequest[] = [
  {
    id: "1",
    refNo: "EXP-1001",
    type: "Guarantee",
    bu: "Finance",
    vendorBeneficiary: "ABC Corp",
    amount: 500000,
    currency: "USD",
    maturityExpiry: "2025-12-31",
    linkedId: "LNK-2001",
    detail: "Performance guarantee for project A",
    status: "Pending",
    UploadBy: "Nishant Sharma",
    UploadDate: "2025-06-20",
  },
  {
    id: "2",
    refNo: "EXP-1002",
    type: "LC",
    bu: "Procurement",
    vendorBeneficiary: "XYZ Ltd",
    amount: 250000,
    currency: "EUR",
    maturityExpiry: "2025-09-15",
    linkedId: "LNK-2002",
    detail: "LC for import of machinery",
    status: "Approved",
    UploadBy: "Vaasu Garg",
    UploadDate: "2025-06-19",
  },
  {
    id: "3",
    refNo: "EXP-1003",
    type: "Loan",
    bu: "Operations",
    vendorBeneficiary: "Delta Inc",
    amount: 750000,
    currency: "INR",
    maturityExpiry: "2026-03-31",
    linkedId: "LNK-2003",
    detail: "Short-term working capital loan",
    status: "Rejected",
    UploadBy: "Parth Patel",
    UploadDate: "2025-06-18",
  },
];

const AllExposureRequest: React.FC = () => {
  const [data] = useState<ExposureRequest[]>(mockData);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [statusFilterValue, setStatusFilterValue] = useState("");
  const [buFilterValue, setBuFilterValue] = useState("");
  const [typeFilterValue, setTypeFilterValue] = useState("");
  const [globalFilterValue, setGlobalFilterValue] = useState("");

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
        "detail",
        "status",
        "UploadBy",
        "UploadDate",
      ];
      setColumnOrder(defaultOrder);
    }
  }, [data, columnOrder.length]);

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
        header: "Amount",
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
        accessorKey: "detail",
        header: "Detail",
        cell: ({ getValue }) => (
          <span className="text-gray-700">{getValue() as string}</span>
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
        accessorKey: "UploadBy",
        header: "Upload By",
        cell: ({ getValue }) => (
          <span className="text-gray-700">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "UploadDate",
        header: "Upload Date",
        cell: ({ getValue }) => (
          <span className="text-gray-700">{getValue() as string}</span>
        ),
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
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
      columnOrder,
    },
  });

  const applyFilters = () => {
    setStatusFilter(statusFilterValue);
    setBuFilter(buFilterValue);
    setTypeFilter(typeFilterValue);
    setGlobalFilter(globalFilterValue);
  };

  const resetFilters = () => {
    setStatusFilterValue("");
    setBuFilterValue("");
    setTypeFilterValue("");
    setGlobalFilterValue("");

    setStatusFilter("");
    setBuFilter("");
    setTypeFilter("");
    setGlobalFilter("");
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
            <option value="Procurement">Procurement</option>
            <option value="Operations">Operations</option>
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
            <option value="Guarantee">Guarantee</option>
            <option value="LC">LC</option>
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
        <div className="p-4 border-b flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-800">
            Exposure Requests
          </h4>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
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
              <thead className="bg-gradient-to-b from-green-200 to-blue-100">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        style={{ width: header.getSize() }}
                      >
                        <Droppable id={header.column.id}>
                          <Draggable id={header.column.id}>
                            <div className="cursor-move hover:bg-green-200 rounded px-1 transition duration-150 ease-in-out">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </div>
                          </Draggable>
                        </Droppable>
                      </th>
                    ))}
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
  );
};

const ActionDropdown: React.FC<{ row: ExposureRequest }> = ({ row }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="relative inset-0 z-50"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200">
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
                  console.log("Approve:", row.refNo);
                  setIsOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  console.log("Reject:", row.refNo);
                  setIsOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  console.log("Edit:", row.refNo);
                  setIsOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AllExposureRequest;
