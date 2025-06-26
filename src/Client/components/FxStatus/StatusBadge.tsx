const StatusBadge = ({ status }: { status: string }) => {
  const base =
    "inline-block px-2 py-1 text-xs font-semibold rounded border whitespace-nowrap";
  const map: Record<string, string> = {
    CONFIRMED: "bg-green-100 text-green-800 border-green-400",
    "PARTIALLY CONFIRMED": "bg-yellow-100 text-yellow-800 border-yellow-400",
    REJECTED: "bg-red-100 text-red-800 border-red-400",
    AWAITING: "bg-gray-100 text-gray-800 border-gray-400",
    SENT: "bg-blue-100 text-blue-800 border-blue-400",
    RECEIVED: "bg-green-100 text-green-800 border-green-400",
    "CONTRACT NOTE RECEIVED": "bg-green-100 text-green-800 border-green-400",
    "CONTRACT NOTE DISCREPANCY": "bg-yellow-100 text-yellow-800 border-yellow-400",
    DISCREPANCY: "bg-yellow-100 text-yellow-800 border-yellow-400",
    "N/A": "bg-gray-100 text-gray-800 border-gray-400",
    "NO AMENDMENT": "bg-gray-100 text-gray-800 border-gray-400",
    "AMENDMENT REQUESTED": "bg-yellow-100 text-yellow-800 border-yellow-400",
    "AMENDMENT CONFIRMED": "bg-green-100 text-green-800 border-green-400",
    "AMENDMENT REJECTED": "bg-red-100 text-red-800 border-red-400",
  };
  const key = (status || "").toUpperCase();
  return (
    <span className={`${base} ${map[key] || "bg-gray-100 text-gray-800 border-gray-400"}`}>{status}</span>
  );
};

export default StatusBadge;
