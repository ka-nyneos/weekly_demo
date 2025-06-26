
import Section from "./Section";

const currencyPairs = ["Choose...", "USD/INR", "EUR/USD","GBP/USD" ,"USD/JPY"];
const valueTypes = ["Choose...", "Actual", "Millions", "Thuosands"];

const FinancialDetails = () => (
  <Section title="Financial Details">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Currency Pair</label>
        <select className="border p-2 text-gray-700">
          {currencyPairs.map((pair, index) => (
            <option key={index} value={pair === "Choose..." ? "" : pair}>
              {pair}
            </option>
          ))}
        </select>
      </div>

    
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Value (FCY)</label>
        <input className="border p-2" type="number" step="0.01" placeholder="" />
      </div>

    
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Value Type</label>
        <select className="border p-2 text-gray-700">
          {valueTypes.map((type, index) => (
            <option key={index} value={type === "Choose..." ? "" : type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Spot Rate</label>
        <input className="border p-2" type="number" step="0.0001" placeholder="86.45" />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Forward Points</label>
        <input className="border p-2" type="number" step="0.0001" placeholder="" />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Bank Margin</label>
        <input className="border p-2" type="number" step="0.0001" placeholder="" />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Total Rate</label>
        <input className="border p-2" type="number" step="0.0001" placeholder="" />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Value (LCY)</label>
        <input className="border p-2" type="number" step="0.01" placeholder="Enter amount" />
      </div>
    </div>
  </Section>
);

export default FinancialDetails;
