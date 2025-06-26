import Layout from "../../components/Layout/layout";
import Button from "../../components/ui/Button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";

import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import type {
  ColumnDef,
  ColumnFiltersState,
  Row,
  Column,
} from "@tanstack/react-table";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
  type SortingState,
} from "@tanstack/react-table";

import { Droppable } from "../../components/utils/Droppable";
import { Draggable } from "../../components/utils/Draggable";

type CurrencyData = {
  bu: string;
  currency: string;
  month1: number;
  month2: number;
  month3: number;
  month4to6: number;
  month6plus: number;
};

const fetchBUData = async () => {
  return Promise.resolve([
    {
      bu: "BU1",
      currency: "USD",
      month1: 1000,
      month2: 2000,
      month3: 0,
      month4to6: 28000,
      month6plus: 3500,
    },
    {
      bu: "BU2",
      currency: "EUR",
      month1: 0,
      month2: 1500,
      month3: 2000,
      month4to6: 8500,
      month6plus: 2000,
    },
    {
      bu: "BU2",
      currency: "EUR",
      month1: 0,
      month2: 1500,
      month3: 2000,
      month4to6: 8500,
      month6plus: 2000,
    },
    {
      bu: "BU2",
      currency: "EUR",
      month1: 0,
      month2: 1200,
      month3: 2000,
      month4to6: 9500,
      month6plus: 2000,
    },
    {
      bu: "BU2",
      currency: "EUR",
      month1: 0,
      month2: 7500,
      month3: 2000,
      month4to6: 8500,
      month6plus: 2000,
    },
  ]);
};

export default function HedgingProposalGrid() {
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [data, setData] = useState<CurrencyData[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    { id: "bu", value: "" },
  ]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    fetchBUData().then(setData);
  }, []);

  useEffect(() => {
    if (data.length && columnOrder.length === 0) {
      const defaultOrder = [
        "bu",
        "currency",
        "month1",
        "month2",
        "month3",
        "month4to6",
        "month6plus",
      ];
      setColumnOrder(defaultOrder);
    }
  }, [data, columnOrder.length]);

  type NumericKeys = Extract<
    keyof CurrencyData,
    "month1" | "month2" | "month3" | "month4to6" | "month6plus"
  >;

  const handleInputChange = (
    rowIndex: number,
    columnId: keyof CurrencyData,
    value: string
  ) => {
    const newData = [...data];
    if (
      columnId === "month1" ||
      columnId === "month2" ||
      columnId === "month3" ||
      columnId === "month4to6" ||
      columnId === "month6plus"
    ) {
      newData[rowIndex][columnId as NumericKeys] = parseFloat(value) || 0;
    }
    setData(newData);
  };

  const columns = useMemo<ColumnDef<CurrencyData>[]>(
    () => [
      {
        accessorKey: "bu",
        id: "bu",
        header: () => {
          return (
            <div className="flex items-center justify-start gap-2">
              <span className="font-semibold text-left">BU</span>
              {/* <select
                value={
                  table.getState().columnFilters.find((f) => f.id === "bu")
                    ?.value || ""
                }
                onChange={(e) =>
                  table.setColumnFilters([{ id: "bu", value: e.target.value }])
                }
                className="mt-1 border px-1 py-0.5 rounded text-sm"
              >
                <option value="">All</option>
                <option value="BU1">BU1</option>
                <option value="BU2">BU2</option>
              </select> */}
            </div>
          );
        },
        cell: (info) => (
          <span className="font-semibold text-left">
            {info.getValue() as string}
          </span>
        ),
      },

      {
        accessorKey: "currency",
        id: "currency",
        // header: function CurrencyHeader({ column, table }) {
        //   const [showFilter, setShowFilter] = useState(false);

        //   const filterValue =
        //     table.getState().columnFilters.find((f) => f.id === column.id)
        //       ?.value || "";

        //   return (
        //     <div className="relative">
        //       <div className="flex items-center  gap-1">
        //         <span className="font-semibold text-left">Currency</span>
        //         <button
        //           onClick={() => setShowFilter((prev) => !prev)}
        //           className="text-gray-600 hover:text-black px-1"
        //         >
        //           ⋮
        //         </button>
        //       </div>

        //       {showFilter && (
        //         <div className="absolute z-10 right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-md p-2">
        //           <input
        //             type="text"
        //             placeholder="Search currency"
        //             value={filterValue}
        //             onChange={(e) => column.setFilterValue(e.target.value)}
        //             className="w-full p-1 text-sm border rounded"
        //           />
        //           <button
        //             onClick={() => {
        //               column.setFilterValue("");
        //               setShowFilter(false);
        //             }}
        //             className="text-xs mt-1 text-blue-600 hover:underline"
        //           >
        //             Clear
        //           </button>
        //         </div>
        //       )}
        //     </div>
        //   );
        // },
        header: "Currency",
        cell: (info) => (
          <span className="font-semibold text-left">
            {info.getValue() as string}
          </span>
        ),
        // filterFn: "includesString",
        // enableSorting: false,
      },

      ...["month1", "month2", "month3", "month4to6", "month6plus"].map(
        (key) => ({
          accessorKey: key,
          id: key,
          header: ({ column }) => (
            <button
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="flex items-center justify-center gap-2 font-semibold group text-left"
            >
              <span>
                {
                  {
                    month1: "Month 1",
                    month2: "Month 2",
                    month3: "Month 3",
                    month4to6: "4-6 Months",
                    month6plus: "> 6 Months",
                  }[key]
                }
              </span>
              <span className="text-sm text-gray-500 group-hover:text-black transition-all">
                {{
                  asc: "↑",
                  desc: "↓",
                }[column.getIsSorted() as string] ?? "↕"}
              </span>
            </button>
          ),
          enableSorting: true,
          sortingFn: (rowA, rowB, columnId) => {
            const a = rowA.getValue(columnId) as number;
            const b = rowB.getValue(columnId) as number;
            return a - b;
          },
          cell: ({
            row,
            column,
          }: {
            row: Row<CurrencyData>;
            column: Column<CurrencyData>;
          }) => (
            <input
              type="number"
              value={row.original[column.id as keyof CurrencyData] as number}
              onChange={(e) =>
                handleInputChange(
                  row.index,
                  column.id as keyof CurrencyData,
                  e.target.value
                )
              }
              className="w-full px-2 py-1 border rounded text-right"
            />
          ),
        })
      ),
    ],
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      columnOrder,
      sorting,
      pagination,
    },
    onColumnOrderChange: setColumnOrder,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
  });

  const grandTotal: CurrencyData = useMemo(() => {
    const total: CurrencyData = {
      bu: "",
      currency: "Grand Total",
      month1: 0,
      month2: 0,
      month3: 0,
      month4to6: 0,
      month6plus: 0,
    };
    table.getFilteredRowModel().rows.forEach((row) => {
      const r = row.original;
      total.month1 += r.month1;
      total.month2 += r.month2;
      total.month3 += r.month3;
      total.month4to6 += r.month4to6;
      total.month6plus += r.month6plus;
    });
    return total;
  }, [table.getFilteredRowModel().rows]);

  const resetAmountsToZero = () => {
    const resetData = data.map((row) => ({
      ...row,
      month1: 0,
      month2: 0,
      month3: 0,
      month4to6: 0,
      month6plus: 0,
    }));
    setData(resetData);
  };
  const setFilter = (id: string, value: string) =>
    setColumnFilters((prev) => [
      ...prev.filter((f) => f.id !== id),
      ...(value ? [{ id, value }] : []),
    ]);

  return (
    <Layout title="Hedging Proposal">
      <div className="mb-6 pt-4">
  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {/* Business Unit Filter */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        BU (Business Unit)
      </label>
      <select
        value={
          table.getState().columnFilters.find((f) => f.id === "bu")
            ?.value || ""
        }
        onChange={(e) =>
          table.setColumnFilters([{ id: "bu", value: e.target.value }])
        }
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
      >
        <option value="">All</option>
        <option value="BU1">BU1</option>
        <option value="BU2">BU2</option>
      </select>
    </div>

    {/* Currency Filter */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Filter by Currency:
      </label>
      <select
        onChange={(e) => setFilter("currency", e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
      >
        <option value="">All Currencies</option>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        {/* <option value="GBP">GBP</option> */}
      </select>
    </div>
  </div>
</div>

      <div className="mt-[1rem] bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-800">
            Hedging Proposal
          </h4>

          <div className="flex gap-2">
            <Button
              color="Green"
              categories="Medium"
              onClick={() => {
                alert("Data Saved in the Database.");
              }}
            >
              Save Proposal
            </Button>

            <Button
              color="Red"
              categories="Medium"
              onClick={resetAmountsToZero}
            >
              Reset Amount
            </Button>

            <Button
              color="Blue"
              categories="Medium"
              onClick={() => window.print()}
            >
              Print Summary
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table
            // className="w-full border border-black border-collapse rounded-lg overflow-hidden shadow-sm"
            className="table-fixed w-max min-w-full divide-y divide-gray-200"
          >
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
              <thead
                // className="bg-gradient-to-b from-green-200   to-blue-100 text-md text-black hover:bg-blue-300"
                className="text-left font-medium bg-gradient-to-b from-green-200 to-blue-100"
              >
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        //   className="p-3 text-left border border-gray-300 font-semibold"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <Droppable id={header.column.id}>
                          <Draggable id={header.column.id}>
                            <div
                              //   className="cursor-move hover:bg-green-200 rounded px-1 transition duration-150 ease-in-out"
                              className="cursor-move font-medium hover:bg-green-200 rounded px-1 transition duration-150 ease-in-out"
                            >
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

            <tbody
              //   className="text-sm"
              className="bg-white divide-y divide-gray-200"
            >
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-green-50 transition">
                  {columnOrder.map((columnId) => {
                    const cell = row
                      .getAllCells()
                      .find((c) => c.column.id === columnId);
                    return (
                      <td
                        key={columnId}
                        // className="border p-2 text-left"
                        className="px-6 py-3 whitespace-nowrap text-sm"
                      >
                        {cell &&
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              <tr className="font-bold bg-gray-100 border-t-2 border-gray-400">
                {columnOrder.map((col) => (
                  <td key={col} className="border p-2 text-right">
                    {col === "bu"
                      ? grandTotal.bu
                      : col === "currency"
                      ? grandTotal.currency
                      : (
                          grandTotal[
                            col as keyof Omit<CurrencyData, "bu" | "currency">
                          ] ?? 0
                        ).toFixed(2)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

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
    </Layout>
  );
}
