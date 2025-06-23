// src/Client/Pages/FXBookingDashboard.tsx
import React, { FC, useMemo, useCallback } from "react";
import Layout from "../../components/Layout/layout";
import {
  FaTasks,
  FaFileInvoice,
  FaEdit,
  FaArrowCircleRight,
} from "react-icons/fa";

type FxItem = {
  bu: string;
  bank: string;
  currency: string;
  poNo: string;
  vendor: string;
  exposureAmt: number;
  spotRate: number;
  isHedged: boolean;
  bookingDate: string;
  fxMaturityDate: string;
  requestId: string;
  bankRefNo: string;
  status: string;
  cnStatus: string;
  bookingCharges: number;
  comments: string;
  amendmentStatus: string;
};

// ←– your real data array goes here
const allFxData: FxItem[] = [ /* … */ ];

// -------------------------------------
// Utilities
// -------------------------------------
const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
});

// Navigate (preserves bucketing pattern)
const useNavigateWithFilter = () => {
  return useCallback((type: string, value: string) => {
    sessionStorage.setItem(
      "dashboardFilter",
      JSON.stringify({ type, value })
    );
    window.location.href = "/detailed_view";
  }, []);
};

// Aggregate metrics
type Metrics = ReturnType<typeof computeMetrics>;
function computeMetrics(data: FxItem[]) {
  const m = {
    totalRequests: 0,
    pendingBank: 0,
    confirmed: 0,
    rejected: 0,
    cnReceived: 0,
    cnAwaiting: 0,
    cnDiscrepancies: 0,
    totalCharges: 0,
    totalAmendments: 0,
    pendingAmendments: 0,
    confirmedAmendments: 0,
  };
  data.forEach((i) => {
    m.totalRequests++;
    if (["Sent", "Awaiting Bank Response"].includes(i.status)) m.pendingBank++;
    else if (i.status === "Confirmed") m.confirmed++;
    else if (i.status === "Rejected") m.rejected++;

    if (i.cnStatus === "Contract Note Received") m.cnReceived++;
    else if (i.cnStatus === "Awaiting") m.cnAwaiting++;
    else if (i.cnStatus === "Contract Note Discrepancy") m.cnDiscrepancies++;

    m.totalCharges += i.bookingCharges;
    if (i.amendmentStatus !== "No Amendment") {
      m.totalAmendments++;
      if (i.amendmentStatus === "Amendment Requested") m.pendingAmendments++;
      else if (i.amendmentStatus === "Amendment Confirmed")
        m.confirmedAmendments++;
    }
  });
  return m;
}

// -------------------------------------
// Reusable KPI Card
// -------------------------------------
interface KpiCardProps {
  label: string;
  value: number | string;
  onClick?: VoidFunction;
}
const KpiCard: FC<KpiCardProps> = ({ label, value, onClick }) => (
  <button
    onClick={onClick}
    disabled={!onClick}
    className={`
      bg-white border border-gray-200 rounded-lg p-6 
      text-left shadow-sm transition hover:shadow-md focus:outline-none
      ${onClick ? "cursor-pointer hover:border-teal-400" : "opacity-90"}
    `}
  >
    <div className="text-3xl font-bold text-teal-700 mb-1">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </button>
);

// -------------------------------------
// Section Wrapper
// -------------------------------------
interface SectionProps {
  icon: React.ReactNode;
  title: string;
  items: Array<{
    label: string;
    value: number | string;
    filterType?: string;
    filterValue?: string;
  }>;
}
const KpiSection: FC<SectionProps> = ({ icon, title, items }) => {
  const navigate = useNavigateWithFilter();
  return (
    <div className="mb-8">
      <h3 className="flex items-center text-xl font-semibold text-teal-800 mb-4">
        <span className="mr-2 text-teal-600">{icon}</span>
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((it) => (
          <KpiCard
            key={it.label}
            label={it.label}
            value={it.value}
            onClick={
              it.filterType
                ? () => navigate(it.filterType!, it.filterValue!)
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
};

// -------------------------------------
// Page Component
// -------------------------------------
export default function FXBookingDashboard() {
  const metrics = useMemo(() => computeMetrics(allFxData), []);
  
  return (
    <Layout title="FX Forward Booking Confirmation Dashboard">
      {/* Forward Request Status */}
      <KpiSection
        icon={<FaTasks />}
        title="Forward Request Status Overview"
        items={[
          { label: "Total Requests Sent", value: metrics.totalRequests, filterType: "status", filterValue: "All" },
          { label: "Pending Bank Confirmation", value: metrics.pendingBank, filterType: "status", filterValue: "Awaiting Bank Response" },
          { label: "Confirmed Bookings", value: metrics.confirmed, filterType: "status", filterValue: "Confirmed" },
          { label: "Rejected Bookings", value: metrics.rejected, filterType: "status", filterValue: "Rejected" },
        ]}
      />

      {/* Contract Note & Charges */}
      <KpiSection
        icon={<FaFileInvoice />}
        title="Contract Note & Charges Status"
        items={[
          { label: "Contract Notes Received", value: metrics.cnReceived, filterType: "cnStatus", filterValue: "Contract Note Received" },
          { label: "Awaiting Contract Notes", value: metrics.cnAwaiting, filterType: "cnStatus", filterValue: "Awaiting" },
          { label: "CN Discrepancies", value: metrics.cnDiscrepancies, filterType: "cnStatus", filterValue: "Contract Note Discrepancy" },
          { label: "Total Booking Charges (YTD)", value: currencyFormatter.format(metrics.totalCharges) },
        ]}
      />

      {/* Amendment Tracking */}
      <KpiSection
        icon={<FaEdit />}
        title="Amendment Tracking"
        items={[
          { label: "Pending Amendments", value: metrics.pendingAmendments, filterType: "amendmentStatus", filterValue: "Amendment Requested" },
          { label: "Confirmed Amendments", value: metrics.confirmedAmendments, filterType: "amendmentStatus", filterValue: "Amendment Confirmed" },
          { label: "Total Amendment Requests", value: metrics.totalAmendments },
        ]}
      />

      {/* View All CTA */}
      <div className="text-center mt-6">
        <button
          onClick={() => window.location.href = "/detailed_view"}
          className="inline-flex items-center text-teal-700 hover:text-teal-900 font-medium transition"
        >
          View All Detailed Bookings <FaArrowCircleRight className="ml-2" />
        </button>
      </div>
    </Layout>
  );
}
