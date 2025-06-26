import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/layout';
import Button from '../../components/ui/Button';

// --- Permission and Action Data Structures ---
const PERMISSION_CATEGORIES = [
  {
    category: 'Reports',
    permissions: [
      'kash', 'IT Alerts', 'UAM Reports', 'Routing Distribution Report', 'Login Logout Report', 'Email Template', 'Failure Retry Report', 'Cron Log'
    ]
  },
  {
    category: 'Role',
    permissions: ['viner', 'Roles']
  },
  {
    category: 'Role Permissions',
    permissions: ['Role Permissions']
  },
  {
    category: 'Configuration',
    permissions: [
      'Retry Configuration', 'SIEM Event Config', 'Auth Configuration SSO', 'System Configuration', 'Entity Configuration'
    ]
  },
  {
    category: 'Master',
    permissions: [
      'CRON MASTER', 'Aggregator Party', 'Holiday Master', 'Business Unit Master', 'Routing Rules', 'BIC Codes Master'
    ]
  },
  {
    category: 'Message Flow',
    permissions: [
      'Message Profile', 'Message Partner', 'Message Validation', 'Message Transformation', 'Message Search'
    ]
  },
  {
    category: 'API Configuration',
    permissions: ['API Configuration']
  },
  {
    category: 'Users',
    permissions: ['Users Suspicious Logs', 'Users Internals', 'External user', 'Users']
  },
  {
    category: 'Permission',
    permissions: ['Permission']
  }
];

const PERMISSION_ACTIONS = [
  'Add', 'Edit', 'View', 'Delete', 'Upload', 'List', 'Approve', 'Reject', 'All Records'
];

// Helper to get and set permissions in localStorage
const getPermissions = (roleId: string) => {
  const all = JSON.parse(localStorage.getItem('rolePermissions') || '{}');
  return all[roleId] || {};
};
const setPermissions = (roleId: string, perms: any) => {
  const all = JSON.parse(localStorage.getItem('rolePermissions') || '{}');
  all[roleId] = perms;
  localStorage.setItem('rolePermissions', JSON.stringify(all));
};

// Helper to get all roles from localStorage
const getAllRoles = () => {
  const stored = localStorage.getItem('roles');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }
  return [];
};

// Dummy permission data for pre-existing roles
const DUMMY_PERMISSIONS: Record<string, Record<string, Record<string, boolean>>> = {
  // roleId: { permission: { action: boolean } }
  // Fill with some dummy data for demonstration
  '1': { 'kash': { 'View': true, 'Edit': false } },
  '2': { 'Roles': { 'Add': true, 'Edit': true } },
  // ...
};

// --- Main Assign Permission Page ---
const AssignPermissionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const roleId = params.get('roleId');

  // Tab state
  const [tab, setTab] = useState<'all' | 'awaiting'>('all');
  // All roles
  const [roles, setRoles] = useState(() => getAllRoles());
  // Selected role
  const [selectedRole, setSelectedRole] = useState<string>(roleId || '');
  // Edit mode
  const [editMode, setEditMode] = useState(false);
  // Permission checkboxes
  const [checked, setChecked] = useState<Record<string, Record<string, boolean>>>(() => {
    if (roleId && DUMMY_PERMISSIONS[roleId]) return DUMMY_PERMISSIONS[roleId];
    if (roleId) return getPermissions(roleId);
    return {};
  });

  // On mount, update roles and selectedRole
  useEffect(() => {
    setRoles(getAllRoles());
    if (roleId) setSelectedRole(roleId);
  }, [roleId]);

  // When role changes, load permissions
  useEffect(() => {
    if (selectedRole) {
      // For pre-existing roles, use dummy or localStorage
      setChecked(DUMMY_PERMISSIONS[selectedRole] || getPermissions(selectedRole) || {});
      setEditMode(false);
    } else {
      setChecked({});
      setEditMode(false);
    }
  }, [selectedRole]);

  // Handle checkbox change
  const handleCheck = (perm: string, action: string) => {
    if (!editMode) return;
    setChecked(prev => ({
      ...prev,
      [perm]: {
        ...prev[perm],
        [action]: !prev[perm]?.[action]
      }
    }));
  };

  // Handle save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPermissions(selectedRole, checked);
    setEditMode(false);
    alert('Permissions saved!');
    // --- BACKEND: Save permissions for roleId here ---
  };

  // Handle edit
  const handleEdit = () => setEditMode(true);

  // Tab content
  const renderTabContent = () => {
    if (tab === 'awaiting') {
      return (
        <div className="p-8 text-gray-400 text-center">No awaiting approvals.</div>
      );
    }
    return (
      <form onSubmit={handleSave}>
        <div className="flex items-center gap-4 mb-4">
          <label className="font-semibold text-lg">Select Role<span className="text-red-500"> *</span>:</label>
          <select
            className="border rounded p-2 min-w-[250px]"
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
            disabled={!!roleId}
          >
            <option value="">Select Role</option>
            {roles.map((role: any) => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
          {selectedRole && !editMode && (
            <Button type="button" color="Blue" categories="Medium" onClick={handleEdit}>Edit</Button>
          )}
        </div>
        {selectedRole && (
          <div className=" p-4 overflow-x-auto">
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="p-2 border text-left">Id</th>
                  <th className="p-2 border text-left">Permission</th>
                  {PERMISSION_ACTIONS.map(action => (
                    <th key={action} className="p-2 border text-center">{action}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERMISSION_CATEGORIES.map((cat, catIdx) => (
                  <React.Fragment key={cat.category}>
                    <tr className="bg-gray-100">
                      <td className="p-2 border font-bold" colSpan={2 + PERMISSION_ACTIONS.length}>{catIdx + 1}. {cat.category}</td>
                    </tr>
                    {cat.permissions.map((perm, permIdx) => (
                      <tr key={perm}>
                        <td className="p-2 border text-center">{permIdx + 1}</td>
                        <td className="p-2 border">{perm}</td>
                        {PERMISSION_ACTIONS.map(action => (
                          <td key={action} className="p-2 border text-center">
                            <input
                              type="checkbox"
                              checked={!!checked[perm]?.[action]}
                              disabled={!editMode}
                              onChange={() => handleCheck(perm, action)}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex gap-3 mt-6 justify-end">
          <Button type="button" color="Blue" categories="Medium" onClick={() => navigate('/role-permission/role')}>Back</Button>
          <Button type="submit" color="Green" categories="Medium">Save</Button>
        </div>
      </form>
    );
  };

  return (
    <Layout title="Role Permissions" showButton={false}>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex gap-8 border-b mb-6">
          <Button
            type="button"
            color={tab === 'awaiting' ? 'Green' : 'Blue'}
            categories="Medium"
            className={`pb-2 px-2 font-semibold border-b-2 transition-colors ${tab === 'awaiting' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500'}`}
            onClick={() => setTab('awaiting')}
          >
            Awaiting Approval
          </Button>
          <Button
            type="button"
            color={tab === 'all' ? 'Green' : 'Blue'}
            categories="Medium"
            className={`pb-2 px-2 font-semibold border-b-2 transition-colors ${tab === 'all' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500'}`}
            onClick={() => setTab('all')}
          >
            All
          </Button>
        </div>
        {renderTabContent()}
      </div>
    </Layout>
  );
};

// --- BACKEND: Replace getAllRoles, getPermissions, setPermissions with API/database calls in the future ---

export default AssignPermissionPage;
