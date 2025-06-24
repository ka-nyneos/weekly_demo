import Section from "./Section";

const MockOptions = [
  {
    label: "Order Type",
    options: ["Choose...", "Buy", "Sell"],
  },
  {
    label: "Transaction Type",
    options: ["Choose...", "Swap", "Outright", "Forward"],
  },
  {
    label: "Counterparty",
    options: ["Choose...", "ABC Bank", "XYZ Crop", "Global Traders"],
  },
];

const OrderDetails = () => (
  <Section title="Order Details">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {MockOptions.map(({ label, options }, idx) => (
        <div key={idx} className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">{label}</label>
          <select className="border p-2">
            {options.map((option, optionIdx) => (
              <option key={optionIdx}>{option}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  </Section>
);

export default OrderDetails;
