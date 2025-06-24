import React, { useState} from "react";
import type { ReactNode } from "react";
import { Card, CardContent } from "./crad";

interface SectionProps {
  title ?: string;
  children: ReactNode;
  heading? : string;
}

const Section: React.FC<SectionProps> = ({ title, heading , children }) => {
  const [open, setOpen] = useState(true);

  return (
    <Card className="mb-4 border-bold border-green-100">
      <div
        className="cursor-pointer p-4 text-green-700 font-semibold bg-green-50"
        onClick={() => setOpen(!open)}
      >
        {heading || title}
      </div>
      {open && <CardContent className="p-4 bg-white">{children}</CardContent>}
    </Card>
  );
};

export default Section;
