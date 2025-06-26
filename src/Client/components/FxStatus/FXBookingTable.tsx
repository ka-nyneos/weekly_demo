import { DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Table } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import SortableHeader from "./SortableHeader";

interface FXBookingTableProps {
  table: Table<any>;
  tableRef: React.RefObject<HTMLTableElement>;
  sensors: any;
  columnOrder: string[];
  setColumnOrder: (order: string[]) => void;
  arrayMove: (array: any[], from: number, to: number) => any[];
  closestCenter: any;
}

const FXBookingTable = ({
  table,
  tableRef,
  sensors,
  columnOrder,
  setColumnOrder,
  arrayMove,
  closestCenter,
}: FXBookingTableProps) => (
  <div className="table-responsive max-h-[750px] overflow-y-auto border border-[#d8e6e5] ">
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }: { active: any; over: any }) => {
        if (!over || active.id === over.id) return;
        setColumnOrder(
          arrayMove(
            columnOrder,
            columnOrder.indexOf(active.id as string),
            columnOrder.indexOf(over.id as string)
          )
        );
      }}
    >
      <SortableContext items={columnOrder} strategy={verticalListSortingStrategy}>
        <table
          ref={tableRef}
          className="fx-booking-table table table-fixed w-max min-w-full border-collapse  shadow-sm text-"
        >
          <colgroup>
            {table
              .getAllLeafColumns()
              .filter((c: any) => typeof c.accessorKey === "string")
              .map((col: any) => (
                <col
                  key={col.id}
                  style={{ width: col.getSize() }}
                  className={`w-[${col.getSize()}px]`}
                />
              ))}
          </colgroup>
          <thead className=" z-30 text-left font-medium bg-gradient-to-b from-green-200 to-blue-100">
            {table.getHeaderGroups().map((hg: any) => (
              <tr key={hg.id}>
                {hg.headers.map((h: any) => (
                  <th
                    key={h.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-move bg-gradient-to-b from-green-200 to-blue-100 border-b border-gray-200"
                    style={{ position: "relative" }}
                  >
                    <SortableHeader id={h.column.id}>
                      <div className="cursor-move font-medium hover:bg-green-200 rounded px-1 transition duration-150 ease-in-out flex items-center gap-1">
                        {flexRender(
                          h.column.columnDef.header,
                          h.getContext()
                        )}
                      </div>
                    </SortableHeader>
                    {h.column.getCanResize() && (
                      <div
                        onMouseDown={h.getResizeHandler()}
                        onTouchStart={h.getResizeHandler()}
                        className={`absolute right-0 top-0 h-full w-2 cursor-col-resize select-none z-10 ${
                          h.column.getIsResizing() ? "bg-green-400" : "hover:bg-green-200"
                        }`}
                        style={{ userSelect: "none" }}
                      />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {table.getRowModel().rows.map((row: any) => (
              <tr key={row.id} className="hover:bg-green-50 transition">
                {row.getVisibleCells().map((cell: any) => (
                  <td key={cell.id} className="px-6 py-3 whitespace-nowrap text-sm">
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
      </SortableContext>
    </DndContext>
  </div>
);

export default FXBookingTable;
