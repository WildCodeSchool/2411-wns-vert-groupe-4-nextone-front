import { createElement } from "react";
import { IconType } from "react-icons/lib";

export default function TicketInfos({
  information,
  icon,
}: {
  information: string;
  icon: IconType;
}) {
  return (
    <div className="flex flex-row items-center justify-start">
      {icon && createElement(icon, { className: "mr-4", size: 20 })}
      <p>{information || "N/A"}</p>
    </div>
  );
}
