// src/pages/user-creation.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Layout from "../../components/Layout/layout";
import Button from "../../components/ui/Button";

type FormData = {
  processname: string;
  authenticationType: string;
  employeeName: string;
  usernameOrEmployeeId: string;
  roleName: string;
  email: string;
  mobile: string;
  address: string;
  businessUnitName: string;
};

type User = FormData & { createdAt: string };
type RoleOption = { id: number; name: string };

// Static default users
const DEFAULT_USERS: User[] = [
  {
    processname: "initiatecreateuser",
    authenticationType: "LDAP",
    employeeName: "Alice Johnson",
    usernameOrEmployeeId: "alice.j",
    roleName: "MASTER MAKER",
    email: "alice.johnson@example.com",
    mobile: "+91-9876543210",
    address: "123 Main St, City",
    businessUnitName: "IT Unit",
    createdAt: "2025-06-20 10:15 AM",
  },
  {
    processname: "initiatecreateuser",
    authenticationType: "LDAP",
    employeeName: "Bob Smith",
    usernameOrEmployeeId: "bob.s",
    roleName: "operations",
    email: "bob.smith@example.com",
    mobile: "+91-9123456780",
    address: "456 Side Ave, City",
    businessUnitName: "Ops Unit",
    createdAt: "2025-06-22 02:30 PM",
  },
  {
    processname: "initiatecreateuser",
    authenticationType: "LDAP",
    employeeName: "Carol Lee",
    usernameOrEmployeeId: "carol.l",
    roleName: "UAM MAKER",
    email: "carol.lee@example.com",
    mobile: "+91-9988776655",
    address: "789 Market Rd, City",
    businessUnitName: "Quality Unit",
    createdAt: "2025-06-25 09:45 AM",
  },
];

const UserCreation: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const { register, handleSubmit, reset } = useForm<FormData>();

  // Dynamic users created via form
  const [dynamicUsers, setDynamicUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem("users");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return [];
  });

  // Persist dynamic users
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(dynamicUsers));
  }, [dynamicUsers]);

  // Load roles for dropdown
  const [rolesList] = useState<RoleOption[]>(() => {
    const stored = localStorage.getItem("roles");
    if (stored) {
      try {
        const parsed: any[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.map(r => ({ id: r.id, name: r.name }));
        }
      } catch {}
    }
    return [];
  });

  const openForm = () => {
    setShowForm(true);
    setShowButton(false);
  };

  const closeForm = () => {
    reset();
    setShowForm(false);
    setShowButton(true);
  };

  const onSubmit = (data: FormData) => {
    const newUser: User = {
      ...data,
      createdAt: new Date().toLocaleString(),
    };
    setDynamicUsers(prev => [...prev, newUser]);
    closeForm();
  };

  // Combined list: static defaults always show, then dynamic ones
  const allUsers = [...DEFAULT_USERS, ...dynamicUsers];

  return (
    <Layout
      title="All Users"
      showButton={showButton}
      buttonText="Create New User"
      onButtonClick={openForm}
    >
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg"
          >
            <h2 className="text-2xl font-bold mb-4">Create User</h2>
            <input
              type="hidden"
              value="initiatecreateuser"
              {...register("processname")}
            />

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block mb-1">Authentication Type</label>
                <input
                  type="text"
                  defaultValue="LDAP"
                  {...register("authenticationType", { required: true })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block mb-1">Employee Name</label>
                <input
                  type="text"
                  {...register("employeeName", { required: true })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block mb-1">Username / Employee ID</label>
                <input
                  type="text"
                  {...register("usernameOrEmployeeId", { required: true })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block mb-1">Role Name</label>
                <select
                  {...register("roleName", { required: true })}
                  className="w-full border rounded p-2"
                >
                  <option value="" disabled hidden>
                    Select role
                  </option>
                  {rolesList.map(role => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  {...register("email", { required: true })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block mb-1">Mobile</label>
                <input
                  type="tel"
                  {...register("mobile")}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block mb-1">Address</label>
                <input
                  type="text"
                  {...register("address")}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block mb-1">Business Unit Name</label>
                <input
                  type="text"
                  {...register("businessUnitName")}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                color="Blue"
                categories="Medium"
                onClick={() => reset()}
              >
                Reset
              </Button>
              <Button type="submit" color="Green" categories="Medium">
                Submit
              </Button>
              <Button
                type="button"
                color="Red"
                categories="Medium"
                onClick={closeForm}
              >
                Back
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <h3 className="text-xl font-bold mb-4">Users List</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border text-sm">
            <thead>
              <tr className="bg-indigo-50">
                <th className="p-2 border">Employee Name</th>
                <th className="p-2 border">Username/ID</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Mobile</th>
                <th className="p-2 border">Address</th>
                <th className="p-2 border">Business Unit</th>
                <th className="p-2 border">Created At</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="p-4 text-center text-gray-400"
                  >
                    No users created yet.
                  </td>
                </tr>
              ) : (
                allUsers.map((user, idx) => (
                  <tr key={idx}>
                    <td className="p-2 border">{user.employeeName}</td>
                    <td className="p-2 border">
                      {user.usernameOrEmployeeId}
                    </td>
                    <td className="p-2 border">{user.roleName}</td>
                    <td className="p-2 border">{user.email}</td>
                    <td className="p-2 border">{user.mobile}</td>
                    <td className="p-2 border">{user.address}</td>
                    <td className="p-2 border">
                      {user.businessUnitName}
                    </td>
                    <td className="p-2 border">{user.createdAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default UserCreation;