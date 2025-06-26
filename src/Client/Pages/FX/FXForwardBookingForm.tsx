import React from "react";
import { useLocation } from "react-router-dom";
// import Section from "../../components/FxBooking/Section";
import Button from "../../components/ui/Button";
import TransactionDetails from "../../components/FxBooking/TransactionDetails";
import EntityDetails from "../../components/FxBooking/EntityDetails";
import OrderDetails from "../../components/FxBooking/OrderDetails";
import DeliveryDateDetails from "../../components/FxBooking/DeliveryDateDetails.tsx";
import FinancialDetails from "../../components/FxBooking/FinancialDetails";
import DealerDetails from "../../components/FxBooking/DealerDetails";
import AdditionalDetails from "../../components/FxBooking/AdditionalDetails";
import Layout from "../../components/Layout/layout.tsx";

const FXForwardBookingForm: React.FC = () => {
  const location = useLocation();
  const record = location.state;

  return (
    <Layout title="FX Forward Booking Form">
      <div className="p-6  min-h-screen">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 border-t-4 border border-gray-100">

                <TransactionDetails />

                <EntityDetails />

                <OrderDetails />

                <DeliveryDateDetails />

                <FinancialDetails />
                <DealerDetails />
                <AdditionalDetails />
 
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Button color="Green" categories="Medium">
                  Submit Booking
                </Button>                
                <Button color="Blue" categories="Medium" onClick={() => (window.print())}>
                  Print Form
                </Button>
                <Button color="Green" categories="Medium">
                  Save Draft
                </Button>
                <Button color="Red" categories="Medium">
                  Reset Form
                </Button> 
              </div>
            </div>
          </div>

          {/* Right side - Summary panel */}
          {record && (
            <div className="lg:col-span-1">
  <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 sticky top-20"> {/* Increased top spacing */}
    <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
      Booking For:
    </h2>
    
    <div className="mb-4 text-center">
      <span className="text-blue-600 font-semibold text-base">{record.currency}</span> | 
      <span className="text-green-600 font-semibold text-base ml-1">{record.maturity}</span>
    </div>
    
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <tbody className="bg-white divide-y divide-gray-200">
          {[
            { label: "Payable", value: record.payable },
            { label: "Receivable", value: record.receivable },
            { label: "Forward Buy", value: record.forwardBuy },
            { label: "Forward Sell", value: record.forwardSell },
            {
              label: "Net Exposure",
              value: (record.receivable - record.payable).toFixed(2),
            },
            {
              label: "Net Forward",
              value: (record.forwardBuy - record.forwardSell).toFixed(2),
            },
            {
              label: "Difference",
              value: (
                (record.receivable - record.payable) - 
                (record.forwardBuy - record.forwardSell)
              ).toFixed(2),
            },
          ].map((item, idx) => {
            const isNegative = parseFloat(item.value) < 0;
            const isDifferenceRow = idx === 6;
            const formattedValue = `${item.value}M`; // Add 'M' suffix
            
            return (
              <tr 
                key={idx} 
                className={`${isNegative ? "bg-red-50" : ""} ${isDifferenceRow ? "border-t-2 border-gray-300" : ""}`}
              >
                <td className={`px-4 py-3 ${isDifferenceRow ? "text-gray-700 font-semibold" : "text-gray-600"}`}>
                  {item.label}
                </td>
                <td className={`px-4 py-3 text-right ${isNegative ? "text-red-600 font-bold" : isDifferenceRow ? "text-blue-600 font-bold" : "text-gray-900"}`}>
                  {formattedValue} {/* Use formatted value with 'M' */}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    
    <div className="mt-4 text-sm text-gray-500 text-center">
      Last updated: {new Date().toLocaleString()}
    </div>
  </div>
</div>
            // </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FXForwardBookingForm;