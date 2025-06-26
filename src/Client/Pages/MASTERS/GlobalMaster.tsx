'use client';

import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/layout';
import Button from '../../components/ui/Button';

// Type
export type Configuration = {
  name: string;
  type: 'Hosted' | 'Whitelabel';
  logo?: File | null;
  logoUrl?: string;
};

export default function GlobalMaster() {
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Configuration>({ name: '', type: 'Hosted', logo: null });
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [configurations, setConfigurations] = useState<Configuration[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('globalConfigs') || '[]');
    setConfigurations(saved);
  }, []);

  const isActiveTab = (id: 'pending' | 'all') => activeTab === id;

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, logo: file }));
      setPreviewLogo(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = { 
      ...formData, 
      logoUrl: formData.logo ? previewLogo : (editIndex !== null ? configurations[editIndex].logoUrl : null)
    };
    const updated = [...configurations];

    if (editIndex !== null) {
      updated[editIndex] = newEntry;
    } else {
      updated.push(newEntry);
    }

    setConfigurations(updated);
    localStorage.setItem('globalConfigs', JSON.stringify(updated));

    // Always update the title immediately
    localStorage.setItem('sidebarTitle', formData.name);
    
    // Only update logo if it's a Whitelabel type and a logo was provided
    if (formData.type === 'Whitelabel' && formData.logo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem('sidebarLogo', reader.result as string);
        window.dispatchEvent(new Event('logoUpdated'));
      };
      reader.readAsDataURL(formData.logo);
    } else if (formData.type === 'Hosted') {
      // Clear logo if switching to Hosted type
      localStorage.removeItem('sidebarLogo');
      window.dispatchEvent(new Event('logoUpdated'));
    }

    setFormData({ name: '', type: 'Hosted', logo: null });
    setPreviewLogo(null);
    setEditIndex(null);
    setShowForm(false);
    setActiveTab('all');
  };

  const handleDelete = (index: number) => {
    const updated = configurations.filter((_, i) => i !== index);
    setConfigurations(updated);
    localStorage.setItem('globalConfigs', JSON.stringify(updated));
    
    const removed = configurations[index];
    
    // Clear logo if the deleted config was the active one
    if (removed.logoUrl || removed.name === localStorage.getItem('sidebarTitle')) {
      localStorage.removeItem('sidebarLogo');
      localStorage.removeItem('sidebarTitle');
      window.dispatchEvent(new Event('logoUpdated'));
    }
  };

  const handleEdit = (index: number) => {
    const config = configurations[index];
    setFormData({
      name: config.name,
      type: config.type,
      logo: null, // Reset logo file input when editing
    });
    setPreviewLogo(config.logoUrl || null);
    setEditIndex(index);
    setShowForm(true);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Deployment Configuration</h2>
        {!showForm && (
          <Button categories="Medium" color="Green" type="button" onClick={() => setShowForm(true)}>
            <span className="text-white">+ New Configuration</span>
          </Button>
        )}
      </div>

      {/* Tabs */}
      {!showForm && (
        <>
          <div className="flex space-x-2 border-b mb-4">
            {[
              { id: 'pending', label: 'Awaiting Configuration Approval' },
              { id: 'all', label: 'All Configurations' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'pending' | 'all')}
                className={`
                  flex items-center space-x-2 px-6 py-3 text-sm font-medium rounded-t-lg border-b-2 transition-all duration-200
                  ${isActiveTab(tab.id as 'pending' | 'all')
                    ? 'bg-green-700 text-white border-green-700 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-800'}
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'pending' ? (
            <div className="mb-6 text-gray-600">Showing pending configuration requests...</div>
          ) : (
            <div className="grid gap-4">
              {configurations.map((conf, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-white border rounded shadow">
                  <div className="flex items-center gap-4">
                    {conf.logoUrl && <img src={conf.logoUrl} alt="Logo" className="h-8 w-8 rounded" />}
                    <div>
                      <div className="font-medium">{conf.name}</div>
                      <div className="text-sm text-gray-600">{conf.type}</div>
                    </div>
                  </div>
                  <div className="relative">
                    <details className="relative">
                      <summary className="text-xl list-none appearance-none cursor-pointer">&#8942;</summary>

                      <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
                        <button
                          onClick={() => handleEdit(idx)}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(idx)}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </details>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 border p-4 bg-gray-50 rounded">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            {editIndex !== null ? 'Edit Configuration' : 'Create New Configuration'}
          </h3>

          <div>
            <label className="block text-sm font-medium mb-1">Configuration Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Configuration Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Configuration['type'] })}
              className="w-full border p-2 rounded"
            >
              <option value="Hosted">Hosted</option>
              <option value="Whitelabel">Whitelabel</option>
            </select>
          </div>

          {formData.type === 'Whitelabel' && (
            <div>
              <label className="block text-sm font-medium mb-1">Upload Logo (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              {previewLogo && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Preview:</p>
                  <img src={previewLogo} alt="Logo Preview" className="h-16 w-auto rounded border" />
                </div>
              )}
              {editIndex !== null && configurations[editIndex].logoUrl && !previewLogo && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Current Logo:</p>
                  <img src={configurations[editIndex].logoUrl} alt="Current Logo" className="h-16 w-auto rounded border" />
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              color="Red"
              categories="Medium"
              onClick={() => {
                setShowForm(false);
                setFormData({ name: '', type: 'Hosted', logo: null });
                setPreviewLogo(null);
                setEditIndex(null);
              }}
            >
              <span className="text-white">Cancel</span>
            </Button>
            <Button type="submit" color="Green" categories="Medium">
              <span className="text-white">{editIndex !== null ? 'Update' : 'Submit'}</span>
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}