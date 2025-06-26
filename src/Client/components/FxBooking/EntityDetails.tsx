import Section from "./Section";
import { useState } from "react";

const EntityDetails = () => {
  const [selectedStore, setSelectedStore] = useState("");

  const stores = [
    "London Store 1",
    "london Store 2",

    // "Berlin Store",
  ];

  return (
    <Section title="Entity Details">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {["GolbalCorp", "Europe Division", "UK Division"].map(( idx) => (
          <div key={idx} className="flex flex-col">
            <label className="text-sm text-gray-600">{`BU Entity ${idx}`}</label>
            <select className="border p-2 bg-gray-100 text-gray-500" disabled>
              <option>{idx}</option>
            </select>
          </div>
        ))}

        {/* Active Store-Level Dropdown */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">BU Entity 4</label>
          <select
            className="border p-2"
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
          >
            <option value="">Choose Store...</option>
            {stores.map((store) => (
              <option key={store} value={store}>
                {store}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Section>
  );
};

export default EntityDetails;
