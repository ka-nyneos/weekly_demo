import Section from "./Section";

const EntityDetails = () => (
  <Section title="Entity Details">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {['BU Entity 1', 'BU Entity 2', 'BU Entity 3', 'BU Entity 4'].map((label, idx) => (
        <div key={idx} className="flex flex-col">
          <label className="text-sm text-gray-600">{label}</label>
          <select className="border p-2">
            <option>Choose...</option>
            <option>Option 1</option>
            <option>Option 2</option>
          </select>
        </div>
      ))}
    </div>
  </Section>
);

export default EntityDetails;