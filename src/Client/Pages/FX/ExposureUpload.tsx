'use client';

import Layout from "../../components/Layout/layout";
import { useMemo, useState, useCallback } from "react";
import AllExposureRequest from "../../components/ExposureUpload/AllExposureRequest";
import PendingRequest from "../../components/ExposureUpload/PendingRequest";
import AddExposure from "../../components/ExposureUpload/AddExposure";
// import PendingRequest from "../../components/ExposureUpload/exp";
// 
const useTabNavigation = (initialTab: string = 'existing') => {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const switchTab = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);
  
  const isActiveTab = useCallback((tab: string) => {
    return activeTab === tab;
  }, [activeTab]);
  
  return {
    activeTab,
    switchTab,
    isActiveTab
  };
};

const TAB_CONFIG = [
  {
    id: 'existing',
    label: 'All Exposure Request',
  },
  {
    id: 'forwards',
    label: 'Pending Exposure Request',
  },
  {
    id: 'add',
    label: 'Add Exposure',
  }
];

const ExposureUpload = () => {
  const { activeTab, switchTab, isActiveTab } = useTabNavigation('existing');

  const tabButtons = useMemo(() => {
    return TAB_CONFIG.map((tab) => (
      <button
        key={tab.id}
        onClick={() => switchTab(tab.id)}
        className={`
          flex items-center space-x-2 px-6 py-3 text-sm font-medium rounded-t-lg border-b-2 transition-all duration-200
          ${isActiveTab(tab.id)
            ? 'bg-green-700 text-white border-green-700 shadow-sm'
            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-800'
          }
        `}
      >
        <span>{tab.label}</span>
      </button>
    ));
  }, [activeTab, switchTab, isActiveTab]);

  const currentContent = useMemo(() => {
    switch (activeTab) {
      case 'existing':
        return <AllExposureRequest />;
      case 'forwards':
        return <PendingRequest />;
      case 'add':
        return <AddExposure />;
      default:
        return <AllExposureRequest />;
    }
  }, [activeTab]);

  return (
    <>
      <Layout title="Exposure Upload & Approval Dashboard" showButton={false}>
        

        <div className="mb-6 pt-4">
          <div className="flex space-x-1 border-b border-gray-200">
            {tabButtons}
          </div>
        </div>

        <div className="transition-opacity duration-300">
           {currentContent}
        </div>

      </Layout>
      
    </>
  );
};

export default ExposureUpload;
