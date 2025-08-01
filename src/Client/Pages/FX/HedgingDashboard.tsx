import React, { useState, useMemo } from "react";
import {
  type ColumnDef,
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
} from "@tanstack/react-table";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import DetailedViews from "../../components/HedgingDashboard/DetailedViews";
import Layout from '../../components/Layout/layout';

type CurrencyRow = {
  maturity: string;
  currency: string;
  payable: number;
  receivable: number;
  forwardBuy: number;
  forwardSell: number;
  bu: string;
};

const rawData: CurrencyRow[] = [
  { bu: "Healthcare", maturity: "Month 1", currency: "USD", payable: 0.02, receivable: 0, forwardBuy: 0, forwardSell: 0 },
  { bu: "Energy", maturity: "Month 2", currency: "EUR", payable: 0.02, receivable: 0, forwardBuy: 0, forwardSell: 0 },
  { bu: "Energy", maturity: "Month 2", currency: "GBP", payable: 0.02, receivable: 0, forwardBuy: 0.02, forwardSell: 0 },
  { bu: "Energy", maturity: "Month 2", currency: "SEK", payable: 0.01, receivable: 0, forwardBuy: 0, forwardSell: 0 },
  { bu: "Healthcare", maturity: "Month 3", currency: "USD", payable: 0.02, receivable: 0, forwardBuy: 0, forwardSell: 0 },
  { bu: "Energy", maturity: "Month 3", currency: "AUD", payable: 0.01, receivable: 0, forwardBuy: 0, forwardSell: 0 },
  { bu: "XYZ", maturity: "4-6 Months", currency: "USD", payable: 0.02, receivable: 0, forwardBuy: 0.03, forwardSell: 0 },
  { bu: "Manufacturing", maturity: "> 6 Months", currency: "JPY", payable: 0.03, receivable: 0.01, forwardBuy: 0.01, forwardSell: 0.01 },
];

const format = (num: number) => `${num.toFixed(2)}M`;

// Component for individual maturity table
const MaturityTable: React.FC<{
  maturity: string;
  rows: CurrencyRow[];
  columns: ColumnDef<CurrencyRow>[];
  isExpanded: boolean;
  onToggleExpanded: () => void;
}> = ({ maturity, rows, columns, isExpanded, onToggleExpanded }) => {
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const totals = rows.reduce(
    (acc, row) => {
      acc.payable += row.payable;
      acc.receivable += row.receivable;
      acc.forwardBuy += row.forwardBuy;
      acc.forwardSell += row.forwardSell;
      return acc;
    },
    { payable: 0, receivable: 0, forwardBuy: 0, forwardSell: 0 }
  );

  const totalNetExp = totals.receivable - totals.payable;
  const totalNetFwd = totals.forwardBuy - totals.forwardSell;
  const totalDiff = totalNetExp - totalNetFwd;
  const diffColor = totalDiff > 0 ? "text-green-600" : totalDiff < 0 ? "text-red-600" : "text-gray-600";

  return (
    <div className="mb-6 border rounded-lg bg-white shadow">
      <button
        className="w-full text-center font-semibold text-green-900 px-4 py-2 bg-green-100 hover:bg-green-200"
        onClick={onToggleExpanded}
      >
        Maturity: {maturity}
      </button>

      {isExpanded && (
        <div className="overflow-auto">
          <table className="min-w-full text-sm text-center border border-gray-400-t">
            <thead className="text-centre font-medium bg-gradient-to-b from-green-200 to-blue-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-3 py-2 border border-gray-400" colSpan={header.colSpan}>
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
                    <td key={cell.id} className="px-3 py-2 border border-gray-400">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-yellow-50 shadow-md font-semibold">
                <td className="px-3 py-2 border border-gray-400 text-center">Total for {maturity}</td>
                <td className="px-3 py-2 border border-gray-400">{format(totals.payable)}</td>
                <td className="px-3 py-2 border border-gray-400">{format(totals.receivable)}</td>
                <td className="px-3 py-2 border border-gray-400">{format(totalNetExp)}</td>
                <td className="px-3 py-2 border border-gray-400">{format(totals.forwardBuy)}</td>
                <td className="px-3 py-2 border border-gray-400">{format(totals.forwardSell)}</td>
                <td className="px-3 py-2 border border-gray-400">{format(totals.forwardBuy - totals.forwardSell)}</td>
                <td className={`px-3 py-2 border border-gray-400 ${diffColor}`}>{format(totalDiff)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const HedgingDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedBU, setSelectedBU] = useState<string>("");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");
  const [selectedMaturity, setSelectedMaturity] = useState<string>("");

  const filteredData = useMemo(() => {
    return rawData.filter((row) => {
      const matchBU = selectedBU ? row.bu === selectedBU : true;
      const matchCurrency = selectedCurrency ? row.currency === selectedCurrency : true;
      const matchMaturity = selectedMaturity ? row.maturity === selectedMaturity : true;
      return matchBU && matchCurrency && matchMaturity;
    });
  }, [selectedBU, selectedCurrency, selectedMaturity]);

  const groupedData = useMemo(() => {
    const groups: Record<string, CurrencyRow[]> = {};
    filteredData.forEach((row) => {
      if (!groups[row.maturity]) groups[row.maturity] = [];
      groups[row.maturity].push(row);
    });
    return groups;
  }, [filteredData]);

  const [expandedMaturity, setExpandedMaturity] = useState<Record<string, boolean>>({});

  // Initialize expanded state when grouped data changes
  React.useEffect(() => {
    const initialExpanded = Object.keys(groupedData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setExpandedMaturity(initialExpanded);
  }, [groupedData]);

  const handleResetFilters = () => {
    setSelectedBU("");
    setSelectedCurrency("");
    setSelectedMaturity("");
  };

  const columns: ColumnDef<CurrencyRow>[] = [
    {
      header: "Currency",
      accessorKey: "currency",
      cell: (info) => info.getValue(),
    },
    {
      header: "Exposure",
      columns: [
        {
          header: "Payable",
          accessorKey: "payable",
          cell: (info) => format(info.getValue() as number),
        },
        {
          header: "Receivable",
          accessorKey: "receivable",
          cell: (info) => format(info.getValue() as number),
        },
        {
          header: "Net (R - P)",
          cell: ({ row }) =>
            format(row.original.receivable - row.original.payable),
        },
      ],
    },
    {
      header: "Forward",
      columns: [
        {
          header: "Buy",
          accessorKey: "forwardBuy",
          cell: (info) => format(info.getValue() as number),
        },
        {
          header: "Sell",
          accessorKey: "forwardSell",
          cell: (info) => format(info.getValue() as number),
        },
        {
          header: "Net (B - S)",
          cell: ({ row }) =>
            format(row.original.forwardBuy - row.original.forwardSell),
        },
      ],
    },
    {
      header: "Diff (Net Exp - Net Fwd)",
      cell: ({ row }) => {
        const netExp = row.original.receivable - row.original.payable;
        const netFwd = row.original.forwardBuy - row.original.forwardSell;
        const diff = netExp - netFwd;
        const color =
          diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : "text-gray-600";

        return (
          <button
            className={color}
            onClick={() =>
              navigate("/fxbooking", {
                state: {
                  currency: row.original.currency,
                  maturity: row.original.maturity,
                  payable: row.original.payable,
                  receivable: row.original.receivable,
                  forwardBuy: row.original.forwardBuy,
                  forwardSell: row.original.forwardSell,
                },
              })
            }
          >
            {format(diff)}
          </button>
        );
      },
    },
  ];

  const grand = filteredData.reduce(
    (acc, row) => {
      acc.payable += row.payable;
      acc.receivable += row.receivable;
      acc.forwardBuy += row.forwardBuy;
      acc.forwardSell += row.forwardSell;
      return acc;
    },
    { payable: 0, receivable: 0, forwardBuy: 0, forwardSell: 0 }
  );
  const grandNetExp = grand.receivable - grand.payable;
  const grandNetFwd = grand.forwardBuy - grand.forwardSell;
  const grandDiff = grandNetExp - grandNetFwd;
  const grandColor = grandDiff > 0 ? "text-green-600" : grandDiff < 0 ? "text-red-600" : "text-gray-600";

  return (
    <Layout title="Hedging Dashboard">
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold text-green-800 text-center mb-6">
        Net Position Analysis: Exposure, Forwards, and Net Exposure by Currency and Maturity
      </h2>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Business Unit
    </label>
    <select
      value={selectedBU}
      onChange={(e) => setSelectedBU(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
    >
      <option value="">All BUs</option>
      {[...new Set(rawData.map((d) => d.bu))].map((bu) => (
        <option key={bu} value={bu}>
          {bu}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Currency
    </label>
    <select
      value={selectedCurrency}
      onChange={(e) => setSelectedCurrency(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
    >
      <option value="">All Currencies</option>
      {[...new Set(rawData.map((d) => d.currency))].map((cur) => (
        <option key={cur} value={cur}>
          {cur}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Maturity
    </label>
    <select
      value={selectedMaturity}
      onChange={(e) => setSelectedMaturity(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
    >
      <option value="">All Maturities</option>
      {[...new Set(rawData.map((d) => d.maturity))].map((mat) => (
        <option key={mat} value={mat}>
          {mat}
        </option>
      ))}
    </select>
  </div>

  <div className="flex items-end">
    <Button
      color="Red"
      categories="Large"
      onClick={handleResetFilters}
    >
      Reset Filters
    </Button>
  </div>
  <hr></hr>
</div>


      {Object.entries(groupedData).map(([maturity, rows]) => (
        <MaturityTable
          key={maturity}
          maturity={maturity}
          rows={rows}
          columns={columns}
          isExpanded={expandedMaturity[maturity] || false}
          onToggleExpanded={() =>
            setExpandedMaturity((prev) => ({ ...prev, [maturity]: !prev[maturity] }))
          }
        />
      ))}

      <div className="mt-8 border rounded-lg bg-white shadow overflow-auto">
        <table className="min-w-full text-sm text-center border border-gray-400-t">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-1 py-2 border border-gray-400 text-center">Grand Total (All Filtered Data)</th>
              <td className="px-3 py-2 border border-gray-400">{format(grand.payable)}</td>
              <td className="px-3 py-2 border border-gray-400">{format(grand.receivable)}</td>
              <td className="px-3 py-2 border border-gray-400">{format(grandNetExp)}</td>
              <td className="px-3 py-2 border border-gray-400">{format(grand.forwardBuy)}</td>
              <td className="px-3 py-2 border border-gray-400">{format(grand.forwardSell)}</td>
              <td className="px-3 py-2 border border-gray-400">{format(grandNetFwd)}</td>
              <td className={`px-3 py-2 border border-gray-400 ${grandColor}`}>{format(grandDiff)}</td>
            </tr>
          </thead>
        </table>
      </div>

      <div className="mt-10 flex flex-wrap gap-6 justify-between">
        <div className="flex-1 min-w-[320px] border border-gray-400 rounded-lg bg-white shadow p-4">
          <h3 className="text-lg font-semibold text-green-800 text-center mb-2">
            Exposure: Payable vs. Receivable by Maturity
          </h3>
          <table className="min-w-full text-sm text-center border border-gray-400">
            <thead className="bg-green-100">
              <tr>
                <th className="border border-gray-400 px-2 py-1">Type</th>
                {Object.keys(groupedData).map((maturity) => (
                  <th key={maturity} className="border border-gray-400 px-2 py-1">{maturity}</th>
                ))}
                <th className="border border-gray-400 px-2 py-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {['payable', 'receivable'].map((key) => (
                <tr key={key}>
                  <td className="border border-gray-400 px-2 py-1 capitalize font-semibold bg-green-50">{key}</td>
                  {Object.keys(groupedData).map((maturity) => {
                    const sum = groupedData[maturity].reduce((acc, row) => acc + row[key as keyof CurrencyRow], 0);
                    return <td key={maturity} className="border border-gray-400 px-2 py-1">{format(sum)}</td>;
                  })}
                  <td className="border border-gray-400 px-2 py-1 font-semibold">
                    {format(
                      filteredData.reduce((acc, row) => acc + row[key as keyof CurrencyRow], 0)
                    )}
                  </td>
                </tr>
              ))}
              <tr className="bg-green-50 font-semibold">
                <td className="border border-gray-400 px-2 py-1">Total</td>
                {Object.keys(groupedData).map((maturity) => {
                  const payable = groupedData[maturity].reduce((acc, row) => acc + row.payable, 0);
                  const receivable = groupedData[maturity].reduce((acc, row) => acc + row.receivable, 0);
                  return <td key={maturity} className="border border-gray-400 px-2 py-1">{format(payable + receivable)}</td>;
                })}
                <td className="border border-gray-400 px-2 py-1">{format(grand.payable + grand.receivable)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex-1 min-w-[320px] border border-gray-400 rounded-lg bg-white shadow p-4">
          <h3 className="text-lg font-semibold text-green-800 text-center mb-2">
            Forwards: Buy vs. Sell by Maturity
          </h3>
          <table className="min-w-full text-sm text-center border border-gray-400">
            <thead className="bg-green-100">
              <tr>
                <th className="border border-gray-400 px-2 py-1">Type</th>
                {Object.keys(groupedData).map((maturity) => (
                  <th key={maturity} className="border border-gray-400 px-2 py-1">{maturity}</th>
                ))}
                <th className="border border-gray-400 px-2 py-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {['forwardBuy', 'forwardSell'].map((key) => (
                <tr key={key}>
                  <td className="border border-gray-400 px-2 py-1 capitalize font-semibold bg-green-50">{key.replace('forward', '')}</td>
                  {Object.keys(groupedData).map((maturity) => {
                    const sum = groupedData[maturity].reduce((acc, row) => acc + row[key as keyof CurrencyRow], 0);
                    return <td key={maturity} className="border border-gray-400 px-2 py-1">{format(sum)}</td>;
                  })}
                  <td className="border border-gray-400 px-2 py-1 font-semibold">
                    {format(
                      filteredData.reduce((acc, row) => acc + row[key as keyof CurrencyRow], 0)
                    )}
                  </td>
                </tr>
              ))}
              <tr className="bg-green-50 font-semibold">
                <td className="border border-gray-400 px-2 py-1">Total</td>
                {Object.keys(groupedData).map((maturity) => {
                  const buy = groupedData[maturity].reduce((acc, row) => acc + row.forwardBuy, 0);
                  const sell = groupedData[maturity].reduce((acc, row) => acc + row.forwardSell, 0);
                  return <td key={maturity} className="border border-gray-400 px-2 py-1">{format(buy + sell)}</td>;
                })}
                <td className="border border-gray-400 px-2 py-1">{format(grand.forwardBuy + grand.forwardSell)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <DetailedViews />
    </div>
    </Layout>
  );
};

export default HedgingDashboard;