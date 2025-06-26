import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { exposureData, fxRates, format } from "./sharedData";

const columns: ColumnDef<any>[] = [
  { header: "Type", accessorKey: "type" },
  { header: "ID", accessorKey: "id" },
  { header: "Client", accessorKey: "client" },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: (info) => (info.getValue() as number),
  },
  { header: "Maturity Date", accessorKey: "maturityDate" },
  { header: "Maturity Bucket", accessorKey: "maturityBucket" },
];

const ExposureDetails: React.FC = () => {
  const groupedData = useMemo(() => {
    const map: Record<string, Record<string, typeof exposureData>> = {};
    exposureData.forEach((row) => {
      if (!map[row.bu]) map[row.bu] = {};
      if (!map[row.bu][row.currency]) map[row.bu][row.currency] = [];
      map[row.bu][row.currency].push(row);
    });
    return map;
  }, []);

  const maturityUsdTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    exposureData.forEach(({ currency, maturityBucket, amount }) => {
      const rate = fxRates[currency] ?? 1;
      const usdAmount = amount * rate;
      totals[maturityBucket] = (totals[maturityBucket] || 0) + usdAmount;
    });
    return totals;
  }, []);

  const orderedBuckets = ["Month 1", "Month 2", "Month 3", "4-6 Months", "> 6 Months"];

  return (
    <div className="overflow-auto p-4">
      {Object.entries(groupedData).map(([bu, currencyMap]) => (
        Object.entries(currencyMap).map(([currency, records]) => {
          const table = useReactTable({
            data: records,
            columns,
            getCoreRowModel: getCoreRowModel(),
            getFilteredRowModel: getFilteredRowModel(),
          });

          const subtotal = records.reduce((acc, row) => acc + row.amount, 0);

          return (
            <div key={`${bu}-${currency}`} className="mb-8">
              <h4 className="text-md font-semibold text-left text-gray-700 mb-2">
                {bu} – {currency}
              </h4>
              <table className="min-w-full text-sm text-center border border-gray-400 mb-1">
                <thead className="text-left font-medium bg-gradient-to-b from-green-200 to-blue-100">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="border border-gray-400 px-2 py-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="border border-gray-400 px-2 py-1">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="bg-yellow-100 font-semibold shadow-sm">
                    <td colSpan={3} className="text-right px-2 py-1">
                      Subtotal for {currency} ({bu}):
                    </td>
                    <td className="border border-gray-400 px-2 py-1">{format(subtotal, currency)}</td>
                    <td colSpan={2}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })
      ))}

      <table className="min-w-full text-sm text-center border border-gray-400 mt-6 bg-white">
        <thead className="bg-green-100">
          <tr>
            <th className="border border-gray-400 px-2 py-1 text-left">Total by Maturity Bucket:</th>
            {orderedBuckets.map((bucket) => (
              <th key={bucket} className="border border-gray-400 px-2 py-1">{bucket}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="font-semibold text-gray-800">
            <td className="border border-gray-400 px-2 py-1 text-left text-green-800">
              Grand Total across all BUs & Currencies (in USD):
            </td>
            {orderedBuckets.map((bucket) => (
              <td key={bucket} className="border border-gray-400 px-2 py-1">
                {format(maturityUsdTotals[bucket] || 0, "USD")}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ExposureDetails;