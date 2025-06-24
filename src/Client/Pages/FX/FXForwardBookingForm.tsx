import React from "react";
import { useLocation } from "react-router-dom";
import Layout from "../../components/Layout/layout";
import Section from "../../components/FxBooking/Section";
import TransactionDetails from "../../components/FxBooking/TransactionDetails";
import EntityDetails from "../../components/FxBooking/EntityDetails";
import OrderDetails from "../../components/FxBooking/OrderDetails";
import FinancialDetails from "../../components/FxBooking/FinancialDetails";
import DealerDetails from "../../components/FxBooking/DealerDetails";
import AdditionalDetails from "../../components/FxBooking/AdditionalDetails";

const FXForwardBookingForm: React.FC = () => {
  const location = useLocation();
  const record = location.state;

  return (
    <Layout title="FX Forward Booking Form">
      <div className="p-6 bg-gray-100 min-h-screen flex justify-center">
        <div className="w-full">

          {/* Displaying Record Summary */}
          {record && (
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Booking Preview:{" "}
                <span className="text-blue-600">{record.currency}</span> |{" "}
                <span className="text-green-600">{record.maturity}</span>
              </h2>

              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {/* <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th> */}
                    </tr>
                  </thead>
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
                        value: (record.forwardBuy - record.forwardSell).toFixed(
                          2
                        ),
                      },
                      {
                        label: "Difference (Net Exp - Net Fwd)",
                        value: (
                          record.receivable -
                          record.payable -
                          (record.forwardBuy - record.forwardSell)
                        ).toFixed(2),
                      },
                    ].map((item, idx) => {
                      const isNegative = parseFloat(item.value) < 0;
                      const isDifferenceRow = idx === 6;

                      return (
                        <tr
                          key={idx}
                          className={`${isNegative ? "bg-red-50" : ""} ${
                            isDifferenceRow ? "border-t-2 border-gray-300" : ""
                          }`}
                        >
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm font-extrabold ${
                              isDifferenceRow
                                ? "text-gray-700 font-semibold"
                                : "text-gray-700"
                            }`}
                          >
                            {item.label}
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                              isNegative
                                ? "text-red-600 font-bold"
                                : isDifferenceRow
                                ? "text-blue-600 font-bold"
                                : "text-gray-900"
                            }`}
                          >
                            {item.value}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-xs text-gray-500 text-right">
                Last updated: {new Date().toLocaleString()}
              </div>
            </div>
          )}

          <div className="max-w-4xl bg-white rounded-lg shadow p-6 border-t-4 mx-auto">
            {/* Themed sections */}
            <Section heading="Transaction Details">
              <TransactionDetails />
            </Section>
            <Section heading="Entity Details">
              <EntityDetails />
            </Section>
            <Section heading="Order Details">
              <OrderDetails />
            </Section>
            {/* <Section heading="Delivery & Date Details">
              <DeliveryDateDetails />
            </Section> */}
            <Section heading="Financial Details">
              <FinancialDetails />
            </Section>
            <Section heading="Dealer Details">
              <DealerDetails />
            </Section>
            <Section heading="Additional Details">
              <AdditionalDetails />
            </Section>

            {/* Action buttons */}
            <div className="flex justify-center gap-2 mt-6">
              <button className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Submit Booking
              </button>
              <button className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Print Form
              </button>
              <button className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Save Draft
              </button>
              <button className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Reset Form
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FXForwardBookingForm;
