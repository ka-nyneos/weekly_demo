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
    <Card  className="bg-gradient-to-b from-green-200 to-blue-100 mb-4 border-bold" >
      <div
        className="cursor-pointer p-4 text-green-700 font-semibold bg-gradient-to-b from-green-200 to-blue-100"
        onClick={() => setOpen(!open)}
      >
        {heading || title}
      </div>
      {open && <CardContent className="p-4 bg-white">{children}</CardContent>}
    </Card>
  );
};

export default Section;
