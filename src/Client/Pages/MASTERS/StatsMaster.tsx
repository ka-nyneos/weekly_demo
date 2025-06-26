import React, { useState } from 'react';
import Button from '../../components/ui/Button';

type FinancialKeyword = {
  name: string;
  description: string;
  value: number;
};

export default function StatsMaster() {
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FinancialKeyword>({
    name: '',
    description: '',
    value: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted Financial Keyword:', formData);
    // TODO: Save to backend
    setFormData({ name: '', description: '', value: 0 });
    setShowForm(false);
  };

  const onCancel = () => setShowForm(false);
  const isActiveTab = (id: 'pending' | 'all') => activeTab === id;

  return (
    <div className="border rounded-md shadow p-4 bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Stats Master</h2>
        {!showForm && (
          <Button categories="Medium" color="Green" type="button" onClick={() => setShowForm(true)}>
            <span className="text-white">+ Add Financial Metric</span>
          </Button>
        )}
      </div>

      {/* Tabs */}
      {!showForm && (
        <div className="flex space-x-2 border-b">
          {['pending', 'all'].map((tabId) => (
            <button
              key={tabId}
              onClick={() => setActiveTab(tabId as 'pending' | 'all')}
              className={`
                flex items-center space-x-2 px-6 py-3 text-sm font-medium rounded-t-lg border-b-2 transition-all duration-200
                ${isActiveTab(tabId as 'pending' | 'all')
                  ? 'bg-green-700 text-white border-green-700 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-800'}
              `}
            >
              {tabId === 'pending' ? 'Awaiting Approval' : 'All List'}
            </button>
          ))}
        </div>
      )}

      {/* Tab content */}
      {!showForm && (
        <div className="mb-6 text-gray-600 mt-4">
          {activeTab === 'pending' ? (
            <p>Showing financial metrics pending approval...</p>
          ) : (
            <p>Showing all financial metrics...</p>
          )}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="border p-4 rounded bg-gray-50 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Create New Financial Keyword</h3>

          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Value %</label>
            <input
              type="number"
              min="0"
              max="100"
              required
              value={formData.value}
              onChange={(e) =>
                setFormData({ ...formData, value: parseFloat(e.target.value) })
              }
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" color="Red" categories="Medium" onClick={onCancel}>
              <span className="text-white">Cancel</span>
            </Button>
            <Button type="submit" color="Green" categories="Medium">
              <span className="text-white">Submit</span>
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
