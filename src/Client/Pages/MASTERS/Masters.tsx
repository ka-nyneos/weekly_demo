import React, { useState } from 'react';
import Layout from '../../components/Layout/layout';
// import StatsMaster from './StatsMaster';
import GlobalMaster from './GlobalMaster';
import ColorMaster from './ColorMaster';



export default function Masters() {
  const [selectedMaster, setSelectedMaster] = useState('');

  const renderSelectedComponent = () => {
    switch (selectedMaster) {
      case 'color':
        return <ColorMaster />;
      case 'global':
        return <GlobalMaster />;      {/* Dropdown Selector */}
      // case 'bic':
        // return <BicMaster />;
      default:
        return <div className="text-gray-500 italic">Please select a master to configure.</div>;
    }
  };

  return (
    <Layout title="Masters">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Master to Configure
          </label>
          <select
            value={selectedMaster}
            onChange={(e) => setSelectedMaster(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select --</option>
            <option value="color">Color Coding Master</option>
            {/* <option value="bic">Bic Master</option> */}
            <option value="global">Deployment Master</option>
          </select>
        </div>

        {/* Dynamic Component Rendering */}
        <div>{renderSelectedComponent()}</div>
      </div>
    </Layout>
  );
}
