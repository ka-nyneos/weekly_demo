import React from "react";
import Section from "./Section";

const TransactionDetails = () => (
  <Section title="Transaction Details">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">System Transaction ID</label>
        <input
          className="border p-2 bg-gray-100"
          type="text"
          placeholder="Auto-generated"
          disabled
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Internal Reference ID</label>
        <input
          className="border p-2"
          type="text"
          placeholder="Internal Reference ID"
        />
      </div>
    </div>
  </Section>
);

export default TransactionDetails;
