import Button from '../../components/ui/Button';

interface FXBookingFiltersProps {
  pendingFilters: { bu: string; bank: string; currency: string; status: string };
  setPendingFilters: React.Dispatch<React.SetStateAction<any>>;
  buOptions: string[];
  bankOptions: string[];
  currencyOptions: string[];
  statusOptions: string[];
  searchInput: string;
  setSearchInput: (v: string) => void;
  showSuggestions: boolean;
  setShowSuggestions: (v: boolean) => void;
  highlightedSuggestion: number;
  setHighlightedSuggestion: (v: number) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  searchSuggestions: string[];
  handleSuggestionClick: (s: string) => void;
  handleSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSearchBlur: () => void;
  setAppliedFilters: (f: any) => void;
  handleResetFilters: () => void;
}

const FXBookingFilters: React.FC<FXBookingFiltersProps> = ({
  pendingFilters,
  setPendingFilters,
  buOptions,
  bankOptions,
  currencyOptions,
  statusOptions,
  searchInput,
  setSearchInput,
  showSuggestions,
  setShowSuggestions,
  highlightedSuggestion,
  setHighlightedSuggestion,
  searchInputRef,
  searchSuggestions,
  handleSuggestionClick,
  handleSearchKeyDown,
  handleSearchBlur,
  setAppliedFilters,
  handleResetFilters,
}) => (
  <div className="  mb-8 print:hidden">
    <div className=" text-[#000000] border-b font-semibold border-grey-300  py-4 gap-2 text-lg">
      <span className="fa fa-filter" /> Filter FX Booking Requests
    </div>
    <div className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Unit:</label>
          <select
            value={pendingFilters.bu}
            onChange={(e) => setPendingFilters((f: any) => ({ ...f, bu: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">All BUs</option>
            {buOptions.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bank:</label>
          <select
            value={pendingFilters.bank}
            onChange={(e) => setPendingFilters((f: any) => ({ ...f, bank: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">All Banks</option>
            {bankOptions.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Currency Pair:</label>
          <select
            value={pendingFilters.currency}
            onChange={(e) => setPendingFilters((f: any) => ({ ...f, currency: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">All Currencies</option>
            {currencyOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status:</label>
          <select
            value={pendingFilters.status}
            onChange={(e) => setPendingFilters((f: any) => ({ ...f, status: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">All Statuses</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search (Global):</label>
          <input
            ref={searchInputRef}
            type="text"
            value={searchInput}
            onChange={(e) => { setSearchInput(e.target.value); setShowSuggestions(true); setHighlightedSuggestion(-1); }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={handleSearchBlur}
            onKeyDown={handleSearchKeyDown}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Search anything in table..."
            autoComplete="off"
          />
          {/* Suggestion dropdown */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto animate-fade-in" style={{ minWidth: '220px' }}>
              {searchSuggestions.map((s, i) => (
                <div
                  key={s}
                  className={`px-3 py-2 cursor-pointer hover:bg-green-100 text-sm ${i === highlightedSuggestion ? 'bg-green-200 text-green-900 font-semibold' : ''}`}
                  onMouseDown={() => handleSuggestionClick(s)}
                  onMouseEnter={() => setHighlightedSuggestion(i)}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex items-end justify-end gap-2 mt-4 md:mt-0">
          <Button
            color="Green"
            categories="Medium"
            onClick={() => setAppliedFilters({ ...pendingFilters })}
          >
            <span className="fa fa-search" /> Apply Filters
          </Button>
          <Button
            color="Red"
            categories="Medium"
            onClick={handleResetFilters}
          >
            <span className="fa fa-redo" /> Reset Filters
          </Button>
        </div>
      </div>
    </div>
  </div>
);

export default FXBookingFilters;
