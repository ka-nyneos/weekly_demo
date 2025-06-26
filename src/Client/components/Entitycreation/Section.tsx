// components/Section.tsx
import React from "react";

interface SectionProps {
  heading: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  level?: number;
}

const Section: React.FC<SectionProps> = ({
  heading,
  icon,
  children,
  level,
}) => {
  let levelBgColor: string = "  ";

  switch (level) {
    case 1:
      levelBgColor = " bg-blue-100 ";
      break;
    case 2:
      levelBgColor = " bg-green-100 ";
      break;
    case 3:
      levelBgColor = " bg-yellow-100 ";
      break;
    case 4:
      levelBgColor = " bg-purple-100 ";
      break;

    default:
      break;
  }

  return (
    <div
      className={
        "mb-6 rounded-lg overflow-hidden border border-gray-600 shadow-sm " +
        levelBgColor
      }
    >
      <div className={levelBgColor + " px-4 py-2 flex items-center gap-2"}>
        {icon && <span>{icon}</span>}
        <h2 className="text-black-800 font-semibold">{heading}</h2>
      </div>
      <div className="px-4 py-4">{children}</div>
    </div>
  );
};

export default Section;
