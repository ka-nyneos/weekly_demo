import { motion } from "framer-motion";
import React from "react";
import { useForm } from "react-hook-form";

const currencyOptions = ["INR", "USD", "EUR", "GBP", "JPY", "CNY"];
const legalEntityTypes = [
  "Private Limited", "Public Limited", "LLP", "Partnership", "Sole Proprietorship", "Government Entity"
];
const fxAuthorityOptions = ["Allowed", "Not Allowed", "Limited"];

interface Theme {
  bg: string;
  accent: string;
  border: string;
  button: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: BusinessUnitFormData) => void;
  initialData?: Partial<BusinessUnitFormData>;
  theme?: Theme;
}

interface BusinessUnitFormData {
  entityName: string;
  address: string;
  contactNumber: string;
  contactEmail: string;
  uniqueIdentifier: string;
  legalEntityType: string;
  reportingCurrency: string;
  fxAuthority: string;
  fxLimit: number;
  treasuryContact: string;
}

const BusinessUnitModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, initialData, theme }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<BusinessUnitFormData>({
    defaultValues: initialData || {},
  });

  React.useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        setValue(key as keyof BusinessUnitFormData, value as any);
      });
    }
  }, [initialData, setValue]);

  const onSubmitForm = (data: BusinessUnitFormData) => {
    if (onSubmit) onSubmit(data);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  // Use theme or fallback to green
  const bg = theme?.bg || "bg-green-100";
  const accent = theme?.accent || "text-green-700";
  const border = theme?.border || "border-green-300";
  const button = theme?.button || "bg-green-500 hover:bg-green-600 text-white";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`w-full max-w-2xl rounded-xl shadow-lg p-8 relative overflow-y-auto max-h-[90vh] ${bg} ${border} border-4`}
      >
        <button
          className="absolute top-3 right-4 text-xl text-gray-500 hover:text-black"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className={`text-2xl font-bold mb-6 ${accent}`}>Add Business Unit / Company</h2>

        <form onSubmit={handleSubmit(onSubmitForm)} className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <label className="block font-semibold mb-1">Business Unit / Entity Name <span className="text-red-500">*</span></label>
            <input {...register("entityName", { required: "Name is required" })} className="w-full p-2 border border-gray-300 rounded" />
            <p className="text-red-500 text-xs mt-1">{errors.entityName?.message}</p>
          </div>

          <div>
            <label className="block font-semibold mb-1">Address <span className="text-red-500">*</span></label>
            <input {...register("address", {
              required: "Address is required",
              minLength: { value: 10, message: "Address too short" }
            })} className="w-full p-2 border border-gray-300 rounded" />
            <p className="text-red-500 text-xs mt-1">{errors.address?.message}</p>
          </div>

          <div>
            <label className="block font-semibold mb-1">Contact Number <span className="text-red-500">*</span></label>
            <input {...register("contactNumber", {
              required: "Contact number is required",
              pattern: { value: /^\d{10}$/, message: "Must be 10 digits" }
            })} className="w-full p-2 border border-gray-300 rounded" />
            <p className="text-red-500 text-xs mt-1">{errors.contactNumber?.message}</p>
          </div>

          <div>
            <label className="block font-semibold mb-1">Contact Email <span className="text-red-500">*</span></label>
            <input {...register("contactEmail", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" }
            })} className="w-full p-2 border border-gray-300 rounded" />
            <p className="text-red-500 text-xs mt-1">{errors.contactEmail?.message}</p>
          </div>

          <div>
            <label className="block font-semibold mb-1">Unique Identifier (within Group) <span className="text-red-500">*</span></label>
            <input {...register("uniqueIdentifier", {
              required: "Unique Identifier is required",
              minLength: { value: 3, message: "Too short" }
            })} className="w-full p-2 border border-gray-300 rounded uppercase" />
            <p className="text-red-500 text-xs mt-1">{errors.uniqueIdentifier?.message}</p>
          </div>

          <div>
            <label className="block font-semibold mb-1">Legal Entity Type <span className="text-red-500">*</span></label>
            <select {...register("legalEntityType", { required: "Select entity type" })} className="w-full p-2 border border-gray-300 rounded">
              <option value="">-- Select --</option>
              {legalEntityTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <p className="text-red-500 text-xs mt-1">{errors.legalEntityType?.message}</p>
          </div>

          <div>
            <label className="block font-semibold mb-1">Reporting Currency <span className="text-red-500">*</span></label>
            <select {...register("reportingCurrency", { required: "Select currency" })} className="w-full p-2 border border-gray-300 rounded">
              <option value="">-- Select --</option>
              {currencyOptions.map(cur => (
                <option key={cur} value={cur}>{cur}</option>
              ))}
            </select>
            <p className="text-red-500 text-xs mt-1">{errors.reportingCurrency?.message}</p>
          </div>

          <div>
            <label className="block font-semibold mb-1">FX Trading Authority / Mandate <span className="text-red-500">*</span></label>
            <select {...register("fxAuthority", { required: "Select FX authority" })} className="w-full p-2 border border-gray-300 rounded">
              <option value="">-- Select --</option>
              {fxAuthorityOptions.map(val => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
            <p className="text-red-500 text-xs mt-1">{errors.fxAuthority?.message}</p>
          </div>

          <div>
            <label className="block font-semibold mb-1">Internal FX Trading Limit (in USD) <span className="text-red-500">*</span></label>
            <input
              type="number"
              step="0.01"
              {...register("fxLimit", {
                required: "FX limit required",
                min: { value: 0, message: "Must be positive" }
              })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <p className="text-red-500 text-xs mt-1">{errors.fxLimit?.message}</p>
          </div>

          <div>
            <label className="block font-semibold mb-1">Associated Treasury Desk / Contact <span className="text-red-500">*</span></label>
            <input {...register("treasuryContact", {
              required: "Contact is required",
              minLength: { value: 3, message: "Too short" }
            })} className="w-full p-2 border border-gray-300 rounded" />
            <p className="text-red-500 text-xs mt-1">{errors.treasuryContact?.message}</p>
          </div>

          <div className="col-span-2 text-right mt-4">
            <button
              type="submit"
              className={`px-6 py-2 rounded text-base font-semibold shadow ${button}`}
            >
              Submit
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default BusinessUnitModal;
