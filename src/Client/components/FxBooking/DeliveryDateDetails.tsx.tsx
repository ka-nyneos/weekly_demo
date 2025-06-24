import Section from "./Section";

const MockOptions = ["Choose...", "RTGS", "NEFT", "SWIFT", "Wire Transfer"];

const DeliveryDateDetails = () => (
  <Section title="Delivery & Date Details">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Mode of Delivery</label>
        <select className="border p-2 text-gray-700">
          {MockOptions.map((option, index) => (
            <option key={index} value={option === "Choose..." ? "" : option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Add Date</label>
        <input className="border p-2" type="date" />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Settlement Date</label>
        <input className="border p-2" type="date" />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Maturity Date</label>
        <input className="border p-2" type="date" />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Delivery Date</label>
        <input className="border p-2" type="date" />
      </div>
    </div>
  </Section>
);

export default DeliveryDateDetails;
