import React, { useMemo, useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

type ExposureRow = {
  bu: string;
  currency: string;
  type: string;
  id: string;
  client: string;
  amount: number;
  maturityDate: string;
  maturityBucket: string;
};

const fxRates: Record<string, number> = {
  USD: 1,
  EUR: 1.1,
  CHF: 1.05,
  JPY: 0.0065,
};

type ForwardRow = {
  dealId: string;
  bank: string;
  bu: string;
  fcy: string;
  lcy: string;
  fcyAmount: number;
  spotRate: number;
  forwardRate: number;
  marginBps: number;
  lcyValue: number;
  maturityDate: string;
  dealDate: string;
};

const forwardData: ForwardRow[] = [
  { dealId: "FWD-010", bank: "JPMorgan", bu: "Healthcare", fcy: "CHF", lcy: "INR", fcyAmount: 4205.31, spotRate: 92.0632, forwardRate: 91.8890, marginBps: 15, lcyValue: 386421.62, maturityDate: "1/7/2025", dealDate: "20/5/2025" },
  { dealId: "FWD-007", bank: "Goldman Sachs", bu: "Logistics", fcy: "EUR", lcy: "INR", fcyAmount: 0, spotRate: 90.4945, forwardRate: 90.5568, marginBps: 12, lcyValue: 0, maturityDate: "10/7/2025", dealDate: "4/6/2025" },
  { dealId: "FWD-012", bank: "HSBC", bu: "Technology", fcy: "CAD", lcy: "INR", fcyAmount: 5946.81, spotRate: 60.6382, forwardRate: 60.6460, marginBps: 15, lcyValue: 360650.26, maturityDate: "10/7/2025", dealDate: "6/6/2025" },
  { dealId: "FWD-001", bank: "Goldman Sachs", bu: "Technology", fcy: "USD", lcy: "INR", fcyAmount: 12114.63, spotRate: 83.5136, forwardRate: 83.5329, marginBps: 12, lcyValue: 1011970.39, maturityDate: "15/7/2025", dealDate: "18/4/2025" },
  { dealId: "FWD-009", bank: "Citi", bu: "Energy", fcy: "USD", lcy: "INR", fcyAmount: 18000, spotRate: 83.00, forwardRate: 82.75, marginBps: 10, lcyValue: 1494000.00, maturityDate: "5/8/2025", dealDate: "1/7/2025" },
  { dealId: "FWD-011", bank: "JPMorgan", bu: "Energy", fcy: "EUR", lcy: "INR", fcyAmount: 10000, spotRate: 90.00, forwardRate: 89.95, marginBps: 9, lcyValue: 900000.00, maturityDate: "20/9/2025", dealDate: "20/7/2025" },
];


const exposureData: ExposureRow[] = [
  { bu: "Energy", currency: "USD", type: "BS", id: "BS001", client: "Treasury GL", amount: 10000, maturityDate: "1/8/2025", maturityBucket: "Month 2" },
  { bu: "Energy", currency: "USD", type: "LC", id: "LC877", client: "Vendor A", amount: 15000, maturityDate: "5/8/2025", maturityBucket: "Month 2" },
  { bu: "Energy", currency: "EUR", type: "PO", id: "PO123", client: "Supplier X", amount: 9000, maturityDate: "20/9/2025", maturityBucket: "Month 3" },
  { bu: "Healthcare", currency: "CHF", type: "BS", id: "BS002", client: "GL Y", amount: 5000, maturityDate: "1/7/2025", maturityBucket: "Month 1" },
  { bu: "Healthcare", currency: "CHF", type: "LC", id: "LC999", client: "Vendor B", amount: 3000, maturityDate: "2/8/2025", maturityBucket: "Month 2" },
  { bu: "Healthcare", currency: "USD", type: "BS", id: "BS003", client: "GL Z", amount: 4000, maturityDate: "3/9/2025", maturityBucket: "Month 3" },
  { bu: "Manufacturing", currency: "JPY", type: "LC", id: "LC201", client: "Beneficiary Z", amount: 20000, maturityDate: "15/11/2025", maturityBucket: "4-6 Months" },
  { bu: "Manufacturing", currency: "JPY", type: "PO", id: "PO401", client: "Supplier Q", amount: 22000, maturityDate: "10/10/2025", maturityBucket: "4-6 Months" },
];

const format = (num: number, currency = "USD") =>
  num.toLocaleString("en-US", { style: "currency", currency });

const DetailedViews: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"exposure" | "forwards">("exposure");
  const [collapsedExposure, setCollapsedExposure] = useState(false);
  const [collapsedForwards, setCollapsedForwards] = useState(false);

  const groupedData = useMemo(() => {
    const map: Record<string, Record<string, ExposureRow[]>> = {};
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

  const columns: ColumnDef<ExposureRow>[] = [
    { header: "Type", accessorKey: "type" },
    { header: "ID", accessorKey: "id" },
    { header: "Client", accessorKey: "client" },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (info) => format(info.getValue() as number),
    },
    { header: "Maturity Date", accessorKey: "maturityDate" },
    { header: "Maturity Bucket", accessorKey: "maturityBucket" },
  ];

  const forwardColumns: ColumnDef<ForwardRow>[] = [
  { header: "Deal ID", accessorKey: "dealId" },
  { header: "Bank", accessorKey: "bank" },
  { header: "BU", accessorKey: "bu" },
  { header: "FCY", accessorKey: "fcy" },
  { header: "LCY", accessorKey: "lcy" },
  {
    header: "FCY Amount",
    accessorKey: "fcyAmount",
    cell: (info) => format(info.getValue() as number),
  },
  { header: "Spot Rate", accessorKey: "spotRate" },
  { header: "Forward Rate", accessorKey: "forwardRate" },
  { header: "Bank Margin (bps)", accessorKey: "marginBps" },
  {
    header: "LCY Value",
    accessorKey: "lcyValue",
    cell: (info) => format(info.getValue() as number, "INR"),
  },
  { header: "Maturity Date", accessorKey: "maturityDate" },
  { header: "Deal Date", accessorKey: "dealDate" },
];


  return (
    <div className="mt-10 border rounded-lg shadow bg-white">
      <div className="flex justify-between items-center border-b px-4 py-2 bg-gray-100">
        <div className="space-x-2">
          <button
            onClick={() => setActiveTab("exposure")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "exposure" ? "bg-green-700 text-white" : "bg-gray-200"
            } rounded`}
          >
            Existing Exposure Details
          </button>
          <button
            onClick={() => setActiveTab("forwards")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "forwards" ? "bg-green-700 text-white" : "bg-gray-200"
            } rounded`}
          >
            Detailed Forwards Booked
          </button>
        </div>

        <button
          onClick={() =>
            activeTab === "exposure"
              ? setCollapsedExposure((prev) => !prev)
              : setCollapsedForwards((prev) => !prev)
          }
          className="text-sm text-blue-600 underline"
        >
          {activeTab === "exposure"
            ? collapsedExposure ? "Show" : "Hide"
            : collapsedForwards ? "Show" : "Hide"}{" "}
          Detailed View
        </button>
      </div>

      {activeTab === "exposure" && !collapsedExposure && (
        <div className="overflow-auto p-4">
          {Object.entries(groupedData).map(([bu, currencyMap]) =>
            Object.entries(currencyMap).map(([currency, records]) => {
              const table = useReactTable({
                data: records,
                columns,
                getCoreRowModel: getCoreRowModel(),
              });

              const subtotal = records.reduce((acc, row) => acc + row.amount, 0);

              return (
                <div key={`${bu}-${currency}`} className="mb-8">
                  <h4 className="text-md font-semibold text-left text-gray-700 mb-2">
                    {bu} – {currency}
                  </h4>
                  <table className="min-w-full text-sm text-center border mb-1">
                    <thead className="bg-green-100">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <th key={header.id} className="border px-2 py-1">
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
                            <td key={cell.id} className="border px-2 py-1">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr className="bg-yellow-100 font-semibold shadow-sm">
                        <td colSpan={3} className="text-right px-2 py-1">Subtotal for {currency} ({bu}):</td>
                        <td className="border px-2 py-1">{format(subtotal, currency)}</td>
                        <td colSpan={2}></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })
          )}

          <table className="min-w-full text-sm text-center border mt-6 bg-white">
            <thead className="bg-green-100">
              <tr>
                <th className="border px-2 py-1 text-left">Total by Maturity Bucket:</th>
                {orderedBuckets.map((bucket) => (
                  <th key={bucket} className="border px-2 py-1">{bucket}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="font-semibold text-gray-800">
                <td className="border px-2 py-1 text-left text-green-800">
                  Grand Total across all BUs & Currencies:
                </td>
                {orderedBuckets.map((bucket) => (
                  <td key={bucket} className="border px-2 py-1">
                    {format(maturityUsdTotals[bucket] || 0, "USD")}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600">
              Save Proposal
            </button>
            <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600">
              Print Summary
            </button>
            <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500">
              Reset View
            </button>
          </div>
        </div>
      )}

      {activeTab === "forwards" && !collapsedForwards && (
        <div className="p-6 text-gray-600 italic text-center">
          {/* Placeholder for now */}
          Detailed Forwards Booked data coming soon...
        </div>
      )}
    </div>
  );
};

export default DetailedViews;
