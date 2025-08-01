import type { FXBooking } from "./types";

// Sample static data
export const fetchBookingData = async (): Promise<FXBooking[]> => [
  {
    bu: "BU1",
    bank: "HDFC",
    currency: "USD/INR",
    poNo: "PO1234",
    vendor: "Vendor A",
    exposureAmt: "10,000 USD",
    bookingDate: "2025-05-27",
    fxMaturityDate: "2025-06-15",
    requestId: "FXREQ001",
    bankRefNo: "HDFC-XYZ-1",
    status: "CONFIRMED",
    contractNoteStatus: "RECEIVED",
    bookingCharges: "$15.00",
    comments: "Booking confirmed at 83.25",
    actionType: "view-upload",
    amendmentStatus: "NO AMENDMENT",
  },
  {
    bu: "BU2",
    bank: "ICICI",
    currency: "EUR/INR",
    poNo: "PO2345",
    vendor: "Vendor B",
    exposureAmt: "5,000 EUR",
    bookingDate: "2025-05-28",
    fxMaturityDate: "2025-06-18",
    requestId: "FXREQ002",
    bankRefNo: "ICICI-XYZ-2",
    status: "AWAITING",
    contractNoteStatus: "N/A",
    bookingCharges: "$10.00",
    comments: "Pending confirmation",
    actionType: "view-resend",
    amendmentStatus: "AMENDMENT REQUESTED",
  },
  {
    bu: "BU3",
    bank: "SBI",
    currency: "GBP/INR",
    poNo: "PO3456",
    vendor: "Vendor C",
    exposureAmt: "8,000 GBP",
    bookingDate: "2025-05-29",
    fxMaturityDate: "2025-06-19",
    requestId: "FXREQ003",
    bankRefNo: "SBI-XYZ-3",
    status: "REJECTED",
    contractNoteStatus: "DISCREPANCY",
    bookingCharges: "$12.00",
    comments: "Rate mismatch",
    actionType: "view-rebook",
    amendmentStatus: "AMENDMENT REJECTED",
  },
  {
    bu: "BU4",
    bank: "Axis",
    currency: "JPY/INR",
    poNo: "PO4567",
    vendor: "Vendor D",
    exposureAmt: "1,000,000 JPY",
    bookingDate: "2025-05-30",
    fxMaturityDate: "2025-06-20",
    requestId: "FXREQ004",
    bankRefNo: "AXIS-XYZ-4",
    status: "PARTIALLY CONFIRMED",
    contractNoteStatus: "RECEIVED",
    bookingCharges: "$18.00",
    comments: "Partial confirmation",
    actionType: "view-resolve",
    amendmentStatus: "AMENDMENT CONFIRMED",
  },
  {
    bu: "BU5",
    bank: "Kotak",
    currency: "CHF/INR",
    poNo: "PO5678",
    vendor: "Vendor E",
    exposureAmt: "4,000 CHF",
    bookingDate: "2025-05-31",
    fxMaturityDate: "2025-06-21",
    requestId: "FXREQ005",
    bankRefNo: "KOTAK-XYZ-5",
    status: "CONFIRMED",
    contractNoteStatus: "RECEIVED",
    bookingCharges: "$14.00",
    comments: "Confirmed",
    actionType: "view-details",
    amendmentStatus: "NO AMENDMENT",
  },
  {
    bu: "BU7",
    bank: "HDFC",
    currency: "USD/INR",
    poNo: "PO5678",
    vendor: "Vendor C",
    exposureAmt: "12,500 USD",
    bookingDate: "2025-06-10",
    fxMaturityDate: "2025-06-25",
    requestId: "FXREQ003",
    bankRefNo: "HDFC-ABC-3",
    status: "CONFIRMED",
    contractNoteStatus: "SENT",
    bookingCharges: "$15.00",
    comments: "All documents received",
    actionType: "no-action",
    amendmentStatus: "NO AMENDMENT",
  },
  {
    bu: "BU8",
    bank: "AXIS",
    currency: "GBP/INR",
    poNo: "PO8901",
    vendor: "Vendor D",
    exposureAmt: "8,300 GBP",
    bookingDate: "2025-06-12",
    fxMaturityDate: "2025-06-30",
    requestId: "FXREQ004",
    bankRefNo: "AXIS-REF-4",
    status: "AWAITING",
    contractNoteStatus: "PENDING",
    bookingCharges: "$8.00",
    comments: "Needs review",
    actionType: "edit",
    amendmentStatus: "NO AMENDMENT",
  },
  {
    bu: "BU9",
    bank: "SBI",
    currency: "AUD/INR",
    poNo: "PO9012",
    vendor: "Vendor E",
    exposureAmt: "15,000 AUD",
    bookingDate: "2025-06-15",
    fxMaturityDate: "2025-07-10",
    requestId: "FXREQ005",
    bankRefNo: "SBI-987-5",
    status: "CONFIRMED",
    contractNoteStatus: "SENT",
    bookingCharges: "$12.50",
    comments: "OK",
    actionType: "no-action",
    amendmentStatus: "NO AMENDMENT",
  },
  {
    bu: "BU10",
    bank: "CITI",
    currency: "JPY/INR",
    poNo: "PO1111",
    vendor: "Vendor F",
    exposureAmt: "1,000,000 JPY",
    bookingDate: "2025-06-18",
    fxMaturityDate: "2025-07-03",
    requestId: "FXREQ006",
    bankRefNo: "CITI-REF-06",
    status: "AWAITING",
    contractNoteStatus: "N/A",
    bookingCharges: "$25.00",
    comments: "Awaiting confirmation",
    actionType: "view",
    amendmentStatus: "NO AMENDMENT",
  },
  {
    bu: "BU11",
    bank: "BARCLAYS",
    currency: "CAD/INR",
    poNo: "PO2222",
    vendor: "Vendor G",
    exposureAmt: "18,000 CAD",
    bookingDate: "2025-06-20",
    fxMaturityDate: "2025-07-15",
    requestId: "FXREQ007",
    bankRefNo: "BARC-8887",
    status: "CONFIRMED",
    contractNoteStatus: "SENT",
    bookingCharges: "$18.00",
    comments: "Review done",
    actionType: "no-action",
    amendmentStatus: "NO AMENDMENT",
  },
  {
    bu: "BU12",
    bank: "HSBC",
    currency: "CHF/INR",
    poNo: "PO3333",
    vendor: "Vendor H",
    exposureAmt: "22,000 CHF",
    bookingDate: "2025-06-25",
    fxMaturityDate: "2025-07-20",
    requestId: "FXREQ008",
    bankRefNo: "HSBC-777-8",
    status: "AWAITING",
    contractNoteStatus: "PENDING",
    bookingCharges: "$22.00",
    comments: "To be updated",
    actionType: "amend",
    amendmentStatus: "NO AMENDMENT",
  },
];
