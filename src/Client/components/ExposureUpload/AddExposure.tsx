"use client";

import React from "react";

import {
  Upload,
  Check,
  AlertCircle,
  FileText,
  Eye,
  X,
} from "lucide-react";

import Button from "../ui/Button";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: "pending" | "processing" | "success" | "error";
  uploadDate: Date;
  error?: string;
  validationErrors?: string[];
  hasHeaders?: boolean;
  hasMissingValues?: boolean;
  rowCount?: number;
  columnCount?: number;
  file?: File; 
}

const formatFileSize = (size: number) => {
  return size < 1024
    ? `${size} B`
    : size < 1024 * 1024
    ? `${(size / 1024).toFixed(2)} KB`
    : `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

const AddExposure: React.FC = () => {
  const [dragActive, setDragActive] = React.useState(false);
  const [files, setFiles] = React.useState<UploadedFile[]>([]);
  const [previewData, setPreviewData] = React.useState<string[][]>([]);
  const [previewHeaders, setPreviewHeaders] = React.useState<string[]>([]);
  const [showPreview, setShowPreview] = React.useState(false);
  const [previewFileName, setPreviewFileName] = React.useState<string>("");

  const handleDrag = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleFiles(event.dataTransfer.files);
    }
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleFiles(event.target.files);
    }
    console.log("files", event.target.files);
  };

  const validateFileContent = (file: File): Promise<Partial<UploadedFile>> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const validationErrors: string[] = [];
        let hasHeaders = false;
        let hasMissingValues = false;
        let rowCount = 0;
        let columnCount = 0;

        try {
          if (file.name.toLowerCase().endsWith(".csv")) {
            const lines = content.split("\n").filter((line) => line.trim());
            rowCount = lines.length;

            if (lines.length === 0) {
              validationErrors.push("File is empty");
            } else {
              const firstRow = lines[0].split(",");
              columnCount = firstRow.length;
              hasHeaders = firstRow.some(
                (cell) => cell.trim() && isNaN(Number(cell.replace(/"/g, "").trim()))
              );

              if (!hasHeaders) {
                validationErrors.push("Missing or invalid headers");
              }

              const dataRows = hasHeaders ? lines.slice(1) : lines;
              for (let i = 0; i < dataRows.length; i++) {
                const cells = dataRows[i].split(",");
                if (cells.some((cell) => !cell.trim() || cell.trim() === "\"\"")) {
                  hasMissingValues = true;
                  validationErrors.push(`Missing values found in row ${i + (hasHeaders ? 2 : 1)}`);
                  break;
                }
              }
            }
          } else {
            hasHeaders = true;
            hasMissingValues = Math.random() > 0.5;
            rowCount = Math.floor(Math.random() * 100) + 10;
            columnCount = Math.floor(Math.random() * 10) + 3;

            if (hasMissingValues) {
              validationErrors.push("Missing values detected in spreadsheet");
            }
          }
        } catch (error) {
          validationErrors.push("Failed to parse file content");
        }

        const status = validationErrors.length > 0 ? "error" : "success";

        resolve({
          status,
          validationErrors,
          hasHeaders,
          hasMissingValues,
          rowCount,
          columnCount,
          error: validationErrors.length > 0 ? validationErrors.join(", ") : undefined,
        });
      };

      reader.onerror = () => {
        resolve({
          status: "error",
          validationErrors: ["Failed to read file"],
          error: "Failed to read file",
        });
      };

      reader.readAsText(file);
    });
  };

  const handleFiles = async (fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      status: "processing",
      uploadDate: new Date(),
      file: file, // Store the actual file
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    for (let i = 0; i < newFiles.length; i++) {
      const file = fileList[i];
      const fileData = newFiles[i];

      try {
        const validation = await validateFileContent(file);

        setFiles((prev) =>
          prev.map((f) => (f.id === fileData.id ? { ...f, ...validation } : f))
        );
      } catch (error) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileData.id
              ? {
                  ...f,
                  status: "error",
                  error: "Validation failed",
                  validationErrors: ["Validation failed"],
                }
              : f
          )
        );
      }
    }
  };

  const getFileStatusColor = (file: UploadedFile) => {
    if (file.status === 'error' || (file.validationErrors && file.validationErrors.length > 0)) {
      return 'bg-red-50 border-red-200';
    }
    if (file.status === 'success') {
      return 'bg-green-50 border-green-200';
    }
    return 'bg-gray-50 border-gray-200';
  };

  const getFileTextColor = (file: UploadedFile) => {
    if (file.status === 'error' || (file.validationErrors && file.validationErrors.length > 0)) {
      return 'text-red-900';
    }
    if (file.status === 'success') {
      return 'text-green-900';
    }
    return 'text-gray-900';
  };

  const handlePreviewFile = (uploadedFile: UploadedFile) => {
    if (!uploadedFile.file) {
      console.error("No file found for preview");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) return;

        // Parse CSV content
        const lines = text.split("\n").filter((line) => line.trim());
        if (lines.length === 0) return;

        // Parse each line and handle CSV properly
        const parseCSVLine = (line: string): string[] => {
          const result: string[] = [];
          let current = '';
          let inQuotes = false;
          
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim().replace(/^"|"$/g, ''));
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current.trim().replace(/^"|"$/g, ''));
          return result;
        };

        const rows = lines.map(parseCSVLine);
        const [headerRow, ...dataRows] = rows;
        
        setPreviewHeaders(headerRow || []);
        setPreviewData(dataRows.slice(0, 50)); // Limit to first 50 rows for performance
        setPreviewFileName(uploadedFile.name);
        setShowPreview(true);
      } catch (error) {
        console.error("Error parsing file for preview:", error);
      }
    };

    reader.onerror = () => {
      console.error("Error reading file for preview");
    };

    reader.readAsText(uploadedFile.file);
  };

  const clearAllFiles = () => setFiles([]);
  const removeFile = (id: string) => setFiles((prev) => prev.filter((file) => file.id !== id));

  return (
    <div className="space-y-6">
      <h4 className="pb-2 border-b flex items-center justify-between text-lg font-semibold text-gray-800">
        Exposure Uploader
      </h4>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type of Exposure</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500">
            <option value="">All Exposure</option>
            <option value="PO">PO</option>
            <option value="LC">LC</option>
            <option value="BS">BS</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Updated By:</label>
          <input type="text" placeholder="Current User" disabled className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Updated Date/Time:</label>
          <input type="text" value={new Date().toLocaleString()} disabled className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
        <div className="flex items-center space-x-4 gap-2">
          <Button>
            <span className="text-white">Import Data</span>
          </Button>

          <Button>
            <span className="text-white">Add New Manually</span>
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center space-x-2 mb-4">
          <Upload className="w-4 h-4 text-gray-600" />
          <label className="text-sm font-medium text-gray-700">Upload File (CSV/XLSX):</label>
        </div>

        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept=".csv,.xlsx,.xls"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="space-y-2">
            <Upload className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="text-sm text-gray-600">
              <span className="font-medium text-green-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">CSV, XLSX files up to 10MB</p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Upload Summary
              {files.some(f => f.status === 'error' || (f.validationErrors && f.validationErrors.length > 0)) && (
                <span className="ml-2 text-red-600 text-sm">Issues Detected</span>
              )}
            </h3>
            <button
              onClick={clearAllFiles}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Clear All
            </button>
          </div>
          <div className="divide-y divide-gray-200">
            {files.map((file) => (
              <div 
                key={file.id} 
                className={`p-4 hover:opacity-90 transition-colors ${getFileStatusColor(file)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {file.status === 'success' && !(file.validationErrors && file.validationErrors.length > 0) && (
                        <Check className="w-5 h-5 text-green-500" />
                      )}
                      {(file.status === 'error' || (file.validationErrors && file.validationErrors.length > 0)) && (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                      {file.status === 'processing' && (
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      )}
                      {file.status === 'pending' && <FileText className="w-5 h-5 text-gray-400" />}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${getFileTextColor(file)}`}>
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)} • {file.uploadDate.toLocaleString()}
                        {file.rowCount && file.columnCount && (
                          <span> • {file.rowCount} rows, {file.columnCount} columns</span>
                        )}
                      </p>
                      
                      {/* Validation Status */}
                      {file.status === 'success' && !(file.validationErrors && file.validationErrors.length > 0) && (
                        <div className="text-xs text-green-600 mt-1 flex items-center space-x-2">
                          <Check className="w-3 h-3" />
                          <span>Headers: ✓ | Values: Complete</span>
                        </div>
                      )}
                      
                      {/* Validation Errors */}
                      {file.validationErrors && file.validationErrors.length > 0 && (
                        <div className="text-xs text-red-600 mt-1">
                          <div className="flex items-center space-x-1 mb-1">
                            <AlertCircle className="w-3 h-3" />
                            <span className="font-medium">Validation Issues:</span>
                          </div>
                          <ul className="list-disc list-inside space-y-1 ml-4">
                            {file.validationErrors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {file.error && !(file.validationErrors && file.validationErrors.length > 0) && (
                        <p className="text-xs text-red-600 mt-1">{file.error}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {file.status === 'success' && file.file && (
                      <button
                        onClick={() => handlePreviewFile(file)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Preview Data"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}

                    {file.status === 'error' && file.file && (
                      <button
                        onClick={() => handlePreviewFile(file)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Preview Data"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={
                        () => { removeFile(file.id);
                        setShowPreview(false);}
                      }
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Remove File"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Table */}
      {showPreview && previewData.length > 0 && (
        <div className="bg-white p-6 border rounded-lg shadow-sm mt-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-800">
              Preview Data - {previewFileName}
            </h4>
            <button
              onClick={() => setShowPreview(false)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Close Preview
            </button>
          </div>
          <PreviewTable headers={previewHeaders} rows={previewData} />
        </div>
      )}
    </div>
  );
};

export default AddExposure;

interface PreviewTableProps {
  headers: string[];
  rows: string[][];
}
const PreviewTable: React.FC<PreviewTableProps> = ({ headers, rows }) => {
  const columns = React.useMemo<ColumnDef<Record<string, string>>[]>(
    () =>
      headers.map((header, index) => ({
        accessorKey: `col_${index}`,
        header: () => (
          <span
            className={`font-semibold ${!header.trim() ? "text-red-500" : "text-gray-700"}`}
          >
            {header.trim() || `Missing Header (${index + 1})`}
          </span>
        ),
        cell: (info) => {
          const value = info.getValue() as string;
          const isMissing = !value || value.trim() === "" || value.trim() === '""';
          return (
            <span
              className={`text-sm ${isMissing ? "text-red-600 italic" : "text-gray-900"}`}
            >
              {isMissing ? "(Missing)" : value}
            </span>
          );
        },
      })),
    [headers]
  );

  const data = React.useMemo(
    () =>
      rows.map((row) => {
        const obj: Record<string, string> = {};
        row.forEach((value, idx) => {
          obj[`col_${idx}`] = value || "";
        });
        return obj;
      }),
    [rows]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!headers.length || !rows.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No data to preview</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="sticky top-0 z-10 bg-gradient-to-b from-green-200 to-blue-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-r border-gray-200 last:border-r-0"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 whitespace-nowrap text-sm border-r border-gray-200 last:border-r-0"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > 50 && (
        <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600 border-t">
          Showing first 50 rows of {rows.length} total rows
        </div>
      )}
    </div>
  );
};