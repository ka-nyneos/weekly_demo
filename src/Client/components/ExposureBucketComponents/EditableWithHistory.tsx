import React from "react";
import { Info } from "lucide-react";

export interface EditableWithHistoryProps<T> {
  rowIdx: number;
  field: keyof T;
  value: any;
  original: any;
  onChange: (v: string) => void;
  openCell: { row: number; key: keyof T } | null;
  setOpenCell: React.Dispatch<
    React.SetStateAction<{ row: number; key: keyof T } | null>
  >;
  options?: string[];
}

export default function EditableWithHistory<T extends Record<string, any>>({
  rowIdx,
  options,
  field,
  value,
  original,
  onChange,
  openCell,
  setOpenCell,
}: EditableWithHistoryProps<T>) {
  const changed = value !== original;

  return (
    <div
      className={`
        relative w-full rounded
        ${changed ? "bg-blue-300" : ""}
      `}
      onMouseLeave={() => setOpenCell(null)}
    >
     {options ? (
       <select
         value={value}
         onChange={(e) => onChange(e.target.value)}
         className={`
           w-full pl-8 pr-2 py-1 rounded
           bg-transparent border border-gray-300
           focus:outline-none focus:border-blue-500
         `}
       >
         {options.map((opt) => (
           <option key={opt} value={opt}>
             {opt}
           </option>
         ))}
       </select>
     ) : (
       <input
         type="text"
         value={value}
         onChange={(e) => onChange(e.target.value)}
         className={`
           w-full pl-8 pr-2 py-1 text-right rounded
           bg-transparent border border-gray-300
           focus:outline-none focus:border-blue-500
         `}
       />
     )}

      {changed && (
        <Info
          onMouseEnter={() => setOpenCell({ row: rowIdx, key: field })}
          className="
            absolute left-2 top-1/2 transform -translate-y-1/2
            w-5 h-5 stroke-gray-800 bg-white/75
            hover:bg-white rounded-full p-1 cursor-pointer
          "
        />
      )}

      {openCell?.row === rowIdx && openCell.key === field && (
        <div className="absolute z-10 left-2 top-full mt-1 p-2 bg-white border rounded shadow">
          Old value: {original}
        </div>
      )}
    </div>
  );
}
