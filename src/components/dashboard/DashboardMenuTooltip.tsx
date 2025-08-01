import { Link } from "react-router";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { DashboardMenuItem } from "./DashboardLayout";

export default function DashboardMenuTooltip({
  item,
  isActive = false,
  isProfileTooltip = false,
}: {
  item: DashboardMenuItem;
  isActive?: boolean;
  isProfileTooltip?: boolean;
}) {
  if (isProfileTooltip) {
    return (
      <Tooltip>
        <TooltipTrigger className="flex items-center justify-center w-full aspect-square bg-primary text-white rounded-full">
          <Link
            to={item.path}
            className="flex items-center justify-center w-full h-full"
          >
            {item.icon}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{item.name}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger
        className={`flex items-center justify-center w-full aspect-square rounded-md ${
          isActive
            ? "bg-primary text-white"
            : "bg-popover text-primary hover:bg-border transition-colors duration-200"
        }`}
      >
        <Link
          to={item.path}
          className="flex items-center justify-center w-full h-full"
        >
          {item.icon}
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{item.name}</p>
      </TooltipContent>
    </Tooltip>
  );
}
