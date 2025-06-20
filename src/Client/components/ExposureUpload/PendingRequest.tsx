import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  type ColumnDef,
} from "@tanstack/react-table";
import {
//   MoreHorizontal,
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
  status: string;
  checkerComments: string;
}

// Mock data - empty array for headers only
const mockData: ExposureRequest[] = [];

const PendingRequest: React.FC = () => {
  const [data] = useState<ExposureRequest[]>(mockData);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

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
        cell: ({ getValue }) => (
          <span className="text-gray-700 max-w-xs truncate block">
            {getValue() as string}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        // cell: ({ row }) => (
        //   <ActionDropdown row={row.original} />
        // ),
        size: 80,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

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
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500">
            <option value="">All Currencies</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div className="flex items-end">
          <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
            Apply Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-800">
            Exposure Requests Pending for Approval
          </h4>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 transition">
              Approve selected
            </button>
            <button className="px-4 py-1.5 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition">
              Reject selected
            </button>
            <button className="px-4 py-1.5 text-sm font-medium text-gray-800 bg-gray-200 rounded hover:bg-gray-300 transition">
              Save Draft Comments
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

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

// Action Dropdown Component
// const ActionDropdown: React.FC<{ row: ExposureRequest }> = ({ row }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
//       >
//         <MoreHorizontal className="w-4 h-4" />
//       </button>

//       {isOpen && (
//         <>
//           <div
//             className="fixed inset-0 z-10"
//             onClick={() => setIsOpen(false)}
//           />
//           <div className="absolute right-0 z-20 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200">
//             <div className="py-1">
//               <button
//                 onClick={() => {
//                   console.log('View details for:', row.refNo);
//                   setIsOpen(false);
//                 }}
//                 className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
//               >
//                 View Details
//               </button>
//               <button
//                 onClick={() => {
//                   console.log('Approve:', row.refNo);
//                   setIsOpen(false);
//                 }}
//                 className="block w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-gray-100"
//               >
//                 Approve
//               </button>
//               <button
//                 onClick={() => {
//                   console.log('Reject:', row.refNo);
//                   setIsOpen(false);
//                 }}
//                 className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
//               >
//                 Reject
//               </button>
//               <button
//                 onClick={() => {
//                   console.log('Edit:', row.refNo);
//                   setIsOpen(false);
//                 }}
//                 className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
//               >
//                 Edit
//               </button>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

export default PendingRequest;
