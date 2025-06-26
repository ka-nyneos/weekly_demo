import React from "react";
import Button from "../../components/ui/Button";

const FXBookingActionButtons: React.FC<{ onPrint: () => void; onExport: () => void }> = ({ onPrint, onExport }) => (
  <div className="flex justify-end gap-4 mt-4 print:hidden">
    <Button
      onClick={onPrint}
      color="Blue"
      categories="Medium"
      // className="flex items-center gap-2"
    >
      <span className="fa fa-print" /> Print Table
    </Button>
    <Button
      onClick={onExport}
      color="Green"
      categories="Medium"
      // className="flex items-center gap-2"
    >
      <span className="fa fa-file-export" /> Export to CSV
    </Button>
  </div>
);

export default FXBookingActionButtons;
