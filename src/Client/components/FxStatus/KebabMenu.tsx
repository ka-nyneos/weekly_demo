import { useEffect, useRef, useState } from "react";

const ACTION_LABELS: Record<string, string> = {
  view: "View",
  "view-upload": "Upload CN",
  "view-resend": "Resend",
  "view-rebook": "Rebook",
  "view-resolve": "Resolve",
  "view-details": "Details",
};

const ACTION_STYLES: Record<string, string> = {
  view: " text-sky-800 hover:bg-sky-200 ",
  "view-upload": " hover:bg-green-200 ",
  "view-resend": " text-yellow-800 hover:bg-yellow-200 ",
  "view-rebook": " text-blue-800 hover:bg-blue-200 ",
  "view-resolve": "text-red-800 hover:bg-red-200 ",
  "view-details": " text-gray-800 hover:bg-gray-200 ",
};

const KebabMenu = ({ actions, onAction }: { actions: string[]; onAction: (action: string) => void }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-200 focus:outline-none border border-gray-300 shadow-sm"
        onClick={() => setOpen((v) => !v)}
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span className="sr-only">Open actions</span>
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
          <circle cx="10" cy="4" r="1.5" />
          <circle cx="10" cy="10" r="1.5" />
          <circle cx="10" cy="16" r="1.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 min-w-[150px] rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-50 animate-fade-in border border-gray-200">
          <div className="py-2 flex flex-col gap-1">
            {actions.map((action) => (
              <button
                key={action}
                onClick={() => { setOpen(false); onAction(action); }}
                className={
                  "w-full text-left px-4 py-2 text-sm rounded-lg transition font-semibold flex items-center gap-2 " +
                  (ACTION_STYLES[action] || "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200")
                }
              >
                <span className="capitalize">{ACTION_LABELS[action] || action}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KebabMenu;
