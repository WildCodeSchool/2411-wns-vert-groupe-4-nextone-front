import { Link, useNavigate } from "react-router";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { DashboardMenuItem } from "./DashboardLayout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { UserAuthContext } from "@/context/AuthContext";

export default function DashboardMenuTooltip({
  item,
  isActive = false,
  user = null,
  logout,
}: {
  item: DashboardMenuItem;
  isActive?: boolean;
  user?: UserAuthContext | null;
  logout?: () => Promise<void>;
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (!logout) return;

    logout();
    navigate("/login");
  };

  if (user) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center justify-center w-full aspect-square bg-primary text-white rounded-full cursor-pointer">
              {item.icon}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 z-50 ml-4 p-2 bg-card"
            side="right"
            align="end"
          >
            <DropdownMenuLabel>
              <p>
                {user?.firstName} {user?.lastName}
              </p>
              <p>Administrateur</p>
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
                Paramètres
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLogout()}>
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
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
