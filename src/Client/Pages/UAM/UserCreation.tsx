"use client";

import { useState } from "react";
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
  officeStartTimeIST: string;
  officeEndTimeIST: string;
};

const UserCreation = () => {
  const [showForm, setShowForm] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [title, setTitle] = useState("All Users");

  const { register, handleSubmit, reset } = useForm<FormData>();

  const PageChange = () => {
    setShowForm(true);
    setShowButton(false);
    setTitle("Create User Form");
  };

  const onReset = () => {
    reset();
  };

  const onBack = () => {
    setShowForm(false);
    setShowButton(true);
    setTitle("All Users");
  };

  const onSubmit = (data: FormData) => {
    alert("Form submitted successfully!");
    console.log("Form Data:", data);
    reset();
    setShowForm(false);
    setShowButton(true);
    setTitle("All Users");
  };



  return (
    <Layout
      title={title}
      showButton={showButton}
      buttonText="Create New User"
      onButtonClick={PageChange}
    >
      {showForm && (
        <div className="p-6 rounded-xl border border-gray-300 bg-white shadow-md space-y-6">
          <h2 className="text-xl font-semibold">Create User Form</h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-x-6 gap-y-4"
          >
            <input
              type="hidden"
              value="initiatecreateuser"
              {...register("processname")}
            />

            <div>
              <label>Authentication Type</label>
              <input
                type="text"
                defaultValue="LDAP"
                {...register("authenticationType",{
                    required: "Please enter your autentication type.",
                })}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label>Employee Name</label>
              <input
                type="text"
                {...register("employeeName", {
                  required: "Please enter your employee name.",
                })}
                placeholder="Please enter your first employee name."
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label>Username / Employee ID</label>
              <input
                type="text"
                {...register("usernameOrEmployeeId",{
                    required: "Please enter your username or employee ID.",
                })}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label>Role Name</label>
              <select
                {...register("roleName",{
                    required: "Please enter your role name.",
                })}
                className="w-full p-2 border rounded"
                
              > 
                <option value="" disabled selected hidden></option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
            </div>

            <div>
              <label>Email</label>
              <input
                type="email"
                {...register("email",{
                    required: "Please enter your email.",
                })}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label>Mobile</label>
              <input
                type="tel"
                {...register("mobile",{value:""})}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label>Address</label>
              <input
                type="text"
                {...register("address",{value:""})}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label>Business Unit Name</label>
              <input
                type="text"
                {...register("businessUnitName")}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label>Office Start Time (IST)</label>
              <input
                type="time"
                {...register("officeStartTimeIST")}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label>Office End Time (IST)</label>
              <input
                type="time"
                {...register("officeEndTimeIST")}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="col-span-2 flex justify-end gap-4 mt-4">
              <Button type="button" onClick={onReset}>
                <span className="text-white">Reset</span>
              </Button>
              <Button type="submit">
                <span className="text-white">Submit</span>
              </Button>

              <Button type="button" onClick={onBack}>
                <span className="text-white">Back</span>
              </Button>
            </div>
          </form>
        </div>
      )}

      {!showForm && <h1>User Creation</h1>}
    </Layout>
  );
};

export default UserCreation;
