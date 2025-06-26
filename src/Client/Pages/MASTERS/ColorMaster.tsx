'use client';

import React, { useState } from 'react';
import Layout from '../../components/Layout/layout';
import Button from '../../components/ui/Button';

type ColorCode = {
  name: string;
  min: number;
  max: number;
  colorClass: string; // e.g., hsl(120, 100%, 50%)
};

export default function ColorMaster() {
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ColorCode>({
    name: '',
    min: 0,
    max: 100,
    colorClass: 'hsl(120, 100%, 50%)',
  });

  const isActiveTab = (id: 'pending' | 'all') => activeTab === id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New Color Code:', formData);
    setFormData({ name: '', min: 0, max: 100, colorClass: 'hsl(120, 100%, 50%)' });
    setShowForm(false);
  };

  const onCancel = () => {
    setShowForm(false);
    setFormData({ name: '', min: 0, max: 100, colorClass: 'hsl(120, 100%, 50%)' });
  };

  // Calculate the color preview based on min/max values
  const calculatePreviewColor = () => {
    const midValue = (formData.min + formData.max) / 2;
    const hue = (1 - midValue / 100) * 120;
    return `hsl(${hue}, 100%, 50%)`;
  };

  return (
    <div className="w-full border rounded-md shadow p-6 bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Color Master</h2>
        {!showForm && (
          <Button categories="Medium" color="Green" type="button" onClick={() => setShowForm(true)}>
            <span className="text-white">+ Add Color Code</span>
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
            <p>Showing color codes pending approval...</p>
          ) : (
            <p>Showing all color codes...</p>
          )}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="border p-4 rounded bg-gray-50 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Create New Color Code</h3>

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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Min % (0-100)</label>
              <input
                type="number"
                required
                min="0"
                max="100"
                value={formData.min}
                onChange={(e) => setFormData({ ...formData, min: parseFloat(e.target.value) })}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Max % (0-100)</label>
              <input
                type="number"
                required
                min="0"
                max="100"
                value={formData.max}
                onChange={(e) => setFormData({ ...formData, max: parseFloat(e.target.value) })}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          {/* Color Preview */}
          <div>
            <label className="block text-sm font-medium mb-1">Color Preview (auto-generated)</label>
            <div 
              className="w-full h-8 rounded border" 
              style={{ backgroundColor: calculatePreviewColor() }}
            />
            <p className="text-xs text-gray-500 mt-1">
              Color will transition from green (0%) to red (100%) based on the range midpoint
            </p>
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