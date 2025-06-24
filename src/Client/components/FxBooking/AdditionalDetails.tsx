import Section from "./Section";

const AdditionalDetails = () => {
  const currentTimestamp = new Date().toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <Section title="Additional Details">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Remarks</label>
          <textarea
            className="border p-2"
            rows={2}
            placeholder="Any additional comments..."
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Narration</label>
          <textarea
            className="border p-2"
            rows={2}
            placeholder="Transaction narration..."
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Transaction Timestamp</label>
          <div className="border p-2 bg-gray-100 text-gray-700 rounded">
            {currentTimestamp}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default AdditionalDetails;
