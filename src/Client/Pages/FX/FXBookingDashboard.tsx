// src/Client/Pages/FXBookingDashboard.tsx
import React, {  useMemo, useCallback, useState, useEffect } from "react"
import Layout from "../../components/Layout/layout"
import {
  FaTasks,
  FaFileInvoice,
  FaEdit,
  FaArrowCircleRight,
} from "react-icons/fa"

type FxItem = {
  status: string
  cnStatus: string
  bookingCharges: number
  amendmentStatus: string
  // the rest of these are just dummies so TypeScript is happy
  bu: string; bank: string; currency: string; poNo: string
  vendor: string; exposureAmt: number; spotRate: number
  isHedged: boolean; bookingDate: string; fxMaturityDate: string
  requestId: string; bankRefNo: string; comments: string
}

// ——————————————————————————————————————————————————————
// 1) SAMPLE DATA (so you get “8,3,3,1…” out of the box)
// ——————————————————————————————————————————————————————
const sampleFxData: FxItem[] = [
  { status: "Sent", cnStatus: "Contract Note Received", bookingCharges:  5, amendmentStatus: "No Amendment", bu:"",bank:"",currency:"",poNo:"",vendor:"",exposureAmt:0,spotRate:0,isHedged:false,bookingDate:"",fxMaturityDate:"",requestId:"",bankRefNo:"",comments:"" },
  { status: "Sent", cnStatus: "Contract Note Received", bookingCharges:  5, amendmentStatus: "Amendment Requested", bu:"",bank:"",currency:"",poNo:"",vendor:"",exposureAmt:0,spotRate:0,isHedged:false,bookingDate:"",fxMaturityDate:"",requestId:"",bankRefNo:"",comments:"" },
  { status: "Sent", cnStatus: "Awaiting",                bookingCharges:  0, amendmentStatus: "Amendment Confirmed", bu:"",bank:"",currency:"",poNo:"",vendor:"",exposureAmt:0,spotRate:0,isHedged:false,bookingDate:"",fxMaturityDate:"",requestId:"",bankRefNo:"",comments:"" },
  { status: "Confirmed", cnStatus: "Awaiting",            bookingCharges: 10, amendmentStatus: "No Amendment", bu:"",bank:"",currency:"",poNo:"",vendor:"",exposureAmt:0,spotRate:0,isHedged:false,bookingDate:"",fxMaturityDate:"",requestId:"",bankRefNo:"",comments:"" },
  { status: "Confirmed", cnStatus: "Contract Note Discrepancy", bookingCharges:15, amendmentStatus: "No Amendment", bu:"",bank:"",currency:"",poNo:"",vendor:"",exposureAmt:0,spotRate:0,isHedged:false,bookingDate:"",fxMaturityDate:"",requestId:"",bankRefNo:"",comments:"" },
  { status: "Confirmed", cnStatus: "Contract Note Received", bookingCharges: 7, amendmentStatus: "Amendment Requested", bu:"",bank:"",currency:"",poNo:"",vendor:"",exposureAmt:0,spotRate:0,isHedged:false,bookingDate:"",fxMaturityDate:"",requestId:"",bankRefNo:"",comments:"" },
  { status: "Rejected", cnStatus: "Awaiting",            bookingCharges:  3, amendmentStatus: "No Amendment", bu:"",bank:"",currency:"",poNo:"",vendor:"",exposureAmt:0,spotRate:0,isHedged:false,bookingDate:"",fxMaturityDate:"",requestId:"",bankRefNo:"",comments:"" },
  { status: "Confirmed", cnStatus: "Awaiting",            bookingCharges:10, amendmentStatus: "No Amendment", bu:"",bank:"",currency:"",poNo:"",vendor:"",exposureAmt:0,spotRate:0,isHedged:false,bookingDate:"",fxMaturityDate:"",requestId:"",bankRefNo:"",comments:"" },
]

// ——————————————————————————————————————————————————————
// 2) UTILS: compute metrics
// ——————————————————————————————————————————————————————
type Metrics = {
  totalRequests: number
  pendingBank: number
  confirmed: number
  rejected: number
  cnReceived: number
  cnAwaiting: number
  cnDiscrepancies: number
  totalCharges: number
  totalAmendments: number
  pendingAmendments: number
  confirmedAmendments: number
}
function computeMetrics(data: FxItem[]): Metrics {
  const m: Metrics = {
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
  }
  data.forEach((i) => {
    m.totalRequests++
    if (["Sent", "Awaiting Bank Response", "Awaiting"].includes(i.status))
      m.pendingBank++
    else if (i.status === "Confirmed")
      m.confirmed++
    else if (i.status === "Rejected")
      m.rejected++

    if (i.cnStatus === "Contract Note Received")
      m.cnReceived++
    else if (i.cnStatus === "Awaiting")
      m.cnAwaiting++
    else if (i.cnStatus === "Contract Note Discrepancy")
      m.cnDiscrepancies++

    m.totalCharges += i.bookingCharges

    if (i.amendmentStatus !== "No Amendment") {
      m.totalAmendments++
      if (i.amendmentStatus === "Amendment Requested")
        m.pendingAmendments++
      else if (i.amendmentStatus === "Amendment Confirmed")
        m.confirmedAmendments++
    }
  })
  return m
}

// ——————————————————————————————————————————————————————
// 3) COUNT-UP HOOK
// ——————————————————————————————————————————————————————
function useCountUp(end: number, duration = 1200) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let start: number | null = null
    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      setValue(Math.floor(progress * end))
      if (progress < 1) window.requestAnimationFrame(step)
    }
    window.requestAnimationFrame(step)
  }, [end, duration])
  return value
}

// pretty INR
const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
})

// preserve your original navigation pattern
const useNavigateWithFilter = () =>
  useCallback((type: string, value: string) => {
    sessionStorage.setItem("dashboardFilter", JSON.stringify({ type, value }))
    window.location.href = "/detailed_view"
  }, [])

// ——————————————————————————————————————————————————————
// 4) KPI CARD + SECTION COMPONENTS (unchanged styling)
// ——————————————————————————————————————————————————————
interface KpiCardProps {
  label: string
  display: number | string
  onClick?: VoidFunction
}
const KpiCard: FC<KpiCardProps> = ({ label, display, onClick }) => (
  <button
    onClick={onClick}
    disabled={!onClick}
    className={`
      bg-white border border-gray-200 rounded-lg p-6 
      text-left shadow-sm transition hover:shadow-md focus:outline-none
      ${onClick ? "cursor-pointer hover:border-teal-400" : "opacity-90"}
    `}
  >
    <div className="text-3xl font-bold text-teal-700 mb-1">{display}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </button>
)

interface SectionProps {
  icon: React.ReactNode
  title: string
  items: Array<{
    label: string
    value: number | string
    filterType?: string
    filterValue?: string
  }>
}
const KpiSection: FC<SectionProps> = ({ icon, title, items }) => {
  const navigate = useNavigateWithFilter()
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
            display={it.value}
            onClick={
              it.filterType
                ? () => navigate(it.filterType!, it.filterValue!)
                : undefined
            }
          />
        ))}
      </div>
    </div>
  )
}

// ——————————————————————————————————————————————————————
// 5) PAGE!
// ——————————————————————————————————————————————————————
export default function FXBookingDashboard() {
  // 5.1 compute raw metrics from sample data
  const raw = useMemo(() => computeMetrics(sampleFxData), [])

  // 5.2 create count-up values
  const totalRequests     = useCountUp(raw.totalRequests)
  const pendingBank       = useCountUp(raw.pendingBank)
  const confirmed         = useCountUp(raw.confirmed)
  const rejected          = useCountUp(raw.rejected)
  const cnReceived        = useCountUp(raw.cnReceived)
  const cnAwaiting        = useCountUp(raw.cnAwaiting)
  const cnDiscrepancies   = useCountUp(raw.cnDiscrepancies)
  const totalCharges      = useCountUp(raw.totalCharges)
  const pendingAmendments = useCountUp(raw.pendingAmendments)
  const confirmedAmends    = useCountUp(raw.confirmedAmendments)
  const totalAmendments   = useCountUp(raw.totalAmendments)

  return (
    <Layout title="FX Forward Booking Confirmation Dashboard">
      {/* Forward Request Status */}
      <KpiSection
        icon={<FaTasks />}
        title="Forward Request Status"
        items={[
          { label: "Total Requests Sent",         value: totalRequests,     filterType:"status",    filterValue:"All" },
          { label: "Pending Bank Confirmation",   value: pendingBank,       filterType:"status",    filterValue:"Awaiting Bank Response" },
          { label: "Confirmed Bookings",          value: confirmed,         filterType:"status",    filterValue:"Confirmed" },
          { label: "Rejected Bookings",           value: rejected,          filterType:"status",    filterValue:"Rejected" },
        ]}
      />

      {/* Contract Note & Charges */}
      <KpiSection
        icon={<FaFileInvoice />}
        title="Contract Note & Charges Status"
        items={[
          { label: "Contract Notes Received",     value: cnReceived,        filterType:"cnStatus",  filterValue:"Contract Note Received" },
          { label: "Awaiting Contract Notes",     value: cnAwaiting,        filterType:"cnStatus",  filterValue:"Awaiting" },
          { label: "CN Discrepancies",            value: cnDiscrepancies,   filterType:"cnStatus",  filterValue:"Contract Note Discrepancy" },
          {
            label: "Total Booking Charges (YTD)",
            value: currencyFormatter.format(totalCharges),
          },
        ]}
      />

      {/* Amendment Tracking */}
      <KpiSection
        icon={<FaEdit />}
        title="Amendment Tracking"
        items={[
          { label: "Pending Amendments",          value: pendingAmendments, filterType:"amendmentStatus", filterValue:"Amendment Requested" },
          { label: "Confirmed Amendments",        value: confirmedAmends,    filterType:"amendmentStatus", filterValue:"Amendment Confirmed" },
          { label: "Total Amendment Requests",    value: totalAmendments },
        ]}
      />

      {/* CTA */}
      <div className="text-center mt-6">
        <button
          onClick={() => (window.location.href = "/detailed_view")}
          className="inline-flex items-center text-teal-700 hover:text-teal-900 font-medium transition"
        >
          View All Detailed Bookings <FaArrowCircleRight className="ml-2" />
        </button>
      </div>
    </Layout>
  )
}
