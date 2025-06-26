import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const currencyOptions = ["INR", "USD", "EUR", "GBP", "JPY", "CNY"];

const companySchema = z.object({
  companyName: z.string().min(2, "Company Name is required"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  contactNumber: z.string().regex(/^\d{10}$/, "Contact number must be 10 digits"),
  contactEmail: z.string().email("Invalid email address"),
  registrationNumber: z.string().min(5, "Registration Number is required"),
  panOrGst: z.string().regex(/^([A-Z]{5}[0-9]{4}[A-Z]{1})$/, "Invalid PAN format"),
  lei: z.string().regex(/^[A-Z0-9]{20}$/, "LEI must be 20 alphanumeric characters"),
  tin: z.string().regex(/^\d{9}$/, "TIN must be a 9-digit number"),
  defaultCurrency: z.string().min(1, "Select a currency"),
  businessUnits: z.array(z.string()).min(1, "Provide at least one unit"),
  reportingCurrency: z.string().min(1, "Select a currency"),
});

type CompanyFormData = z.infer<typeof companySchema>;

interface Theme {
  bg: string;
  accent: string;
  border: string;
  button: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: CompanyFormData) => void;
  initialData?: Partial<CompanyFormData>;
  theme?: Theme;
}

const EntityDetailsModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, initialData, theme }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: initialData || {},
  });

  // Local state for business units input
  const [businessUnitsInput, setBusinessUnitsInput] = React.useState<string>(
    initialData?.businessUnits ? (Array.isArray(initialData.businessUnits) ? initialData.businessUnits.join(", ") : initialData.businessUnits) : ""
  );

  React.useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (key === "businessUnits") {
          setBusinessUnitsInput(Array.isArray(value) ? value.join(", ") : (value as string));
        } else {
          setValue(key as keyof CompanyFormData, value as any);
        }
      });
    }
  }, [initialData, setValue]);

  const onSubmitForm = (data: CompanyFormData) => {
    // Parse business units input into array
    const businessUnitsArr = businessUnitsInput
      .split(",")
      .map((unit) => unit.trim())
      .filter((unit) => unit.length > 0);
    const formData = { ...data, businessUnits: businessUnitsArr };
    if (onSubmit) onSubmit(formData);
    reset();
    setBusinessUnitsInput("");
    onClose();
  };

  if (!isOpen) return null;

  // Use theme or fallback to blue
  const bg = theme?.bg || "bg-blue-100";
  const accent = theme?.accent || "text-blue-700";
  const border = theme?.border || "border-blue-300";
  const button = theme?.button || "bg-blue-500 hover:bg-blue-600 text-white";

  return (
    <div className={`fixed inset-0 z-50 bg-black/40 flex items-center justify-center`}>
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
        <h2 className={`text-2xl font-bold mb-6 ${accent}`}>Add Company Information</h2>

        <form onSubmit={handleSubmit(onSubmitForm)} className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <label className="block font-semibold mb-1">Company Name <span className="text-red-500">*</span></label>
            <input {...register("companyName")} className="w-full p-2 border border-gray-300 rounded" />
            <p className="text-red-500 text-xs mt-1">{errors.companyName?.message}</p>
          </div>

          <div>
            <label className="block font-semibold mb-1">Address <span className="text-red-500">*</span></label>
            <input {...register("address")} className="w-full p-2 border border-gray-300 rounded" />
            <p className="text-red-500 text-xs mt-1">{errors.address?.message}</p>
          </div>

          <div>
            <label className="block font-semibold mb-1">Contact Number <span className="text-red-500">*</span></label>
            <input {...register("contactNumber")} className="w-full p-2 border border-gray-300 rounded" />
            <p className="text-red-500 text-xs mt-1">{errors.contactNumber?.message}</p>
          </div>

          <div>
            <label className="block font-semibold mb-1">Contact Email <span className="text-red-500">*</span></label>
            <input {...register("contactEmail")} className="w-full p-2 border border-gray-300 rounded" />
            <p className="text-red-500 text-xs mt-1">{errors.contactEmail?.message}</p>
          </div>

          <div>
            <label className="block font-semibold mb-1">Registration Number <span className="text-red-500">*</span></label>
            <input {...register("registrationNumber")} className="w-full p-2 border border-gray-300 rounded" />
            <p className="text-red-500 text-xs mt-1">{errors.registrationNumber?.message}</p>
          </div>

          <div>
            <label className="block font-semibold mb-1">PAN / GST <span className="text-red-500">*</span></label>
            <input {...register("panOrGst")} className="w-full p-2 border border-gray-300 rounded uppercase" />
            <p className="text-red-500 text-xs mt-1">{errors.panOrGst?.message}</p>
          </div>

          <div>
            <label className="block font-semibold mb-1">Legal Entity Identifier (LEI) <span className="text-red-500">*</span></label>
            <input {...register("lei")} className="w-full p-2 border border-gray-300 rounded uppercase" />
            <p className="text-red-500 text-xs mt-1">{errors.lei?.message}</p>
          </div>

          <div>
            <label className="block font-semibold mb-1">TIN <span className="text-red-500">*</span></label>
            <input {...register("tin")} className="w-full p-2 border border-gray-300 rounded" />
            <p className="text-red-500 text-xs mt-1">{errors.tin?.message}</p>
          </div>

          <div>
            <label className="block font-semibold mb-1">Default Currency <span className="text-red-500">*</span></label>
            <select {...register("defaultCurrency")} className="w-full p-2 border border-gray-300 rounded">
              <option value="">-- Select --</option>
              {currencyOptions.map((cur) => (
                <option key={cur} value={cur}>{cur}</option>
              ))}
            </select>
            <p className="text-red-500 text-xs mt-1">{errors.defaultCurrency?.message}</p>
          </div>

          <div>
            <label className="block font-semibold mb-1">Associated Business Units <span className="text-red-500">*</span></label>
            <input 
              value={businessUnitsInput}
              onChange={e => setBusinessUnitsInput(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded" 
              placeholder="Comma separated" 
            />
            <p className="text-red-500 text-xs mt-1">{errors.businessUnits?.message as string}</p>
          </div>

          <div>
            <label className="block font-semibold mb-1">Reporting Currency <span className="text-red-500">*</span></label>
            <select {...register("reportingCurrency")} className="w-full p-2 border border-gray-300 rounded">
              <option value="">-- Select --</option>
              {currencyOptions.map((cur) => (
                <option key={cur} value={cur}>{cur}</option>
              ))}
            </select>
            <p className="text-red-500 text-xs mt-1">{errors.reportingCurrency?.message}</p>
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

export default EntityDetailsModal;
