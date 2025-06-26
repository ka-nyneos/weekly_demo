import React, {useState } from "react";
import ExposureDetails from "./ExposuresDetails";
import ForwardsDetails from "./ForwardsDetails";

const DetailedViews: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"exposure" | "forwards">("exposure");
  const [collapsedExposure, setCollapsedExposure] = useState(false);
  const [collapsedForwards, setCollapsedForwards] = useState(false);

  return (
    <div className="mt-10 border rounded-lg shadow bg-white">
      <div className="flex justify-between items-center border-b px-4 py-2 bg-gray-100">
        <div className="space-x-2">
          <button
            onClick={() => setActiveTab("exposure")}
            className={`px-4 py-2 font-semibold ${
            activeTab === "exposure" ? "bg-green-700 text-white" : "bg-gray-200"
            } rounded`}
          >
            Existing Exposure Details
          </button>
          <button
            onClick={() => setActiveTab("forwards")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "forwards" ? "bg-green-700 text-white" : "bg-gray-200"
            } rounded`}
          >
            Detailed Forwards Booked
          </button>
        </div>

        <button
          onClick={() =>
            activeTab === "exposure"
              ? setCollapsedExposure((prev) => !prev)
              : setCollapsedForwards((prev) => !prev)
          }
          className="px-4 py-2 font-semibold bg-green-700 text-white rounded-md"
        >
          {activeTab === "exposure"
            ? collapsedExposure ? "Show" : "Hide"
            : collapsedForwards ? "Show" : "Hide"} Detailed View
        </button>
      </div>

      {activeTab === "exposure" && !collapsedExposure && <ExposureDetails />}
      {activeTab === "forwards" && !collapsedForwards && <ForwardsDetails />}
    </div>
  );
};

export default DetailedViews;
