import Section from "./Section";

const InternalDealer = ["choose...", "Nishant Sharma", "Kanav Arora", "Shiddarth Bansal"];

const DealerDetails = () => {
  return (
    <Section title="Dealer Details">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Internal Dealer</label>
          <select className="border p-2">
            {InternalDealer.map((dealer, idx) => (
              <option key={idx} value={dealer === "choose..." ? "" : dealer}>
                {dealer}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Counterparty Dealer</label>
          <input
            className="border p-2"
            type="text"
            placeholder="Counterparty Dealer"
          />
        </div>
      </div>
    </Section>
  );
};

export default DealerDetails;
