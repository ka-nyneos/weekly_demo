// Data types for FX Booking
export type AmendmentStatus =
  | "NO AMENDMENT"
  | "AMENDMENT REQUESTED"
  | "AMENDMENT CONFIRMED"
  | "AMENDMENT REJECTED";

export interface FXBooking {
  bu: string;
  bank: string;
  currency: string;
  poNo: string;
  vendor: string;
  exposureAmt: string;
  bookingDate: string;
  fxMaturityDate: string;
  requestId: string;
  bankRefNo: string;
  status: string;
  contractNoteStatus: string;
  bookingCharges: string;
  comments: string;
  actionType: string;
  amendmentStatus: AmendmentStatus;
}
