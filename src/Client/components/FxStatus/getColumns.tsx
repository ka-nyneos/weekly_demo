import type { ColumnDef } from "@tanstack/react-table";
import KebabMenu from "./KebabMenu";
import StatusBadge from "./StatusBadge";
import type { FXBooking } from "./types";

// Table columns definition, receives editing state and handlers as props
const getColumns = (
  columnOrder: string[],
  editingCommentRow: string | null,
  editingCommentValue: string,
  setEditingCommentRow: (id: string | null) => void,
  setEditingCommentValue: (val: string) => void,
  handleCommentSave: (rowId: string) => void
): ColumnDef<FXBooking>[] =>
  columnOrder
    .map((key) => {
      const col = [
        { accessorKey: "bu", header: () => <span className="font-medium">BU</span>, size: 70 },
        { accessorKey: "bank", header: () => <span className="font-medium">Bank</span>, size: 80 },
        { accessorKey: "currency", header: () => <span className="font-medium">Currency</span>, size: 80 },
        { accessorKey: "poNo", header: () => <span className="font-medium">PO No</span>, size: 80 },
        { accessorKey: "vendor", header: () => <span className="font-medium">Vendor</span>, size: 90 },
        { accessorKey: "exposureAmt", header: ({ column }: { column: any }) => (
          <button type="button" className="w-full flex justify-center items-center gap-1 font-medium" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Exposure Amt{{ asc: "↑", desc: "↓" }[column.getIsSorted() as string] ?? "↕"}</button>
        ), size: 90, enableSorting: true, sortingFn: (a: any, b: any, id: string) => {
          const parseNum = (val: any) => {
            if (typeof val === 'number') return val;
            if (typeof val === 'string') {
              // Remove commas, currency, and parse
              return parseFloat(val.replace(/[^\d.-]/g, '')) || 0;
            }
            return 0;
          };
          return parseNum(a.getValue(id)) - parseNum(b.getValue(id));
        } },
        { accessorKey: "bookingDate", header: () => <span className="font-medium">Booking Date</span>, size: 90 },
        { accessorKey: "fxMaturityDate", header: () => <span className="font-medium">FX Maturity Date</span>, size: 90 },
        { accessorKey: "requestId", header: () => <span className="font-medium">Request ID</span>, size: 90 },
        { accessorKey: "bankRefNo", header: () => <span className="font-medium">Bank Ref No.</span>, size: 90 },
        { accessorKey: "status", header: () => <span className="font-medium">Status</span>, cell: ({ getValue }: { getValue: () => unknown }) => <StatusBadge status={String(getValue())} />, size: 80 },
        { accessorKey: "contractNoteStatus", header: () => <span className="font-medium">Contract Note Status</span>, cell: ({ getValue }: { getValue: () => unknown }) => <StatusBadge status={String(getValue())} />, size: 110 },
        { accessorKey: "amendmentStatus", header: () => <span className="font-medium">Amendment Status</span>, cell: ({ getValue }: { getValue: () => unknown }) => <StatusBadge status={String(getValue())} />, size: 110 },
        { accessorKey: "bookingCharges", header: ({ column }: { column: any }) => (
          <button type="button" className="w-full flex justify-center items-center gap-1 font-medium" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Booking Charges{{ asc: "↑", desc: "↓" }[column.getIsSorted() as string] ?? "↕"}</button>
        ), size: 80, enableSorting: true, sortingFn: (a: any, b: any, id: string) => {
          const parseNum = (val: any) => {
            if (typeof val === 'number') return val;
            if (typeof val === 'string') {
              return parseFloat(val.replace(/[^\d.-]/g, '')) || 0;
            }
            return 0;
          };
          return parseNum(a.getValue(id)) - parseNum(b.getValue(id));
        } },
        { accessorKey: "comments", header: () => <span className="font-medium">Comments</span>, cell: ({ row, getValue }: { row: any; getValue: () => unknown }) => {
          const rowId = row.id;
          if (editingCommentRow === rowId) {
            return (
              <input
                autoFocus
                className="border border-[#b2dfdb] rounded px-2 py-1 w-full text-sm focus:border-[#00796b] focus:ring-2 focus:ring-[#00796b]/20"
                value={editingCommentValue}
                onChange={e => setEditingCommentValue(e.target.value)}
                onBlur={() => handleCommentSave(rowId)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleCommentSave(rowId);
                  if (e.key === 'Escape') { setEditingCommentRow(null); setEditingCommentValue(""); }
                }}
              />
            );
          }
          return (
            <div
              className="cursor-pointer min-h-[28px] text-left px-1 hover:bg-[#e6f4f3] rounded transition"
              title="Double click to edit"
              onDoubleClick={() => {
                setEditingCommentRow(rowId);
                setEditingCommentValue(String(getValue() ?? ""));
              }}
            >
              {String(getValue() ?? "") || <span className="text-gray-400 italic">Double click to add</span>}
            </div>
          );
        }, size: 90 },
        { accessorKey: "actionType", header: () => <span className="font-semibold">Action</span>, cell: ({ getValue }: { getValue: () => unknown }) => {
          const value = getValue();
          const actions = value
            ? String(value).split(',').map((v: string) => v.trim()).filter(Boolean)
            : [];
          const ALL_ACTIONS = [
            "view-upload",
            "view-resend",
            "view-rebook",
            "view-resolve",
            "view-details",
            "view",
          ];
          const menuActions = ["view", ...ALL_ACTIONS.filter((a) => actions.includes(a) && a !== "view")];
          return (
            <KebabMenu
              actions={menuActions}
              onAction={(action) => {
                alert(`Action: ${action}`);
              }}
            />
          );
        }, size: 60 },
      ].find((c) => (c as any).accessorKey === key);
      return col ? col : null;
    })
    .filter(Boolean) as ColumnDef<FXBooking>[];

export default getColumns;
