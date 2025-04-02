import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Store,
  TicketCheck,
  FileText,
  ChevronDown,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import logo from "../images/Onlylogo.png";

interface MenuItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isSidebarExpanded: boolean;
  permission?: string | undefined;
}

interface NestedMenuItemProps extends MenuItemProps {
  subItems: {
    to: string;
    label: string;
    permission?: string | undefined;
  }[];
}

const MenuItem: React.FC<MenuItemProps> = ({
  to,
  icon,
  label,
  isSidebarExpanded,
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center px-4 py-3 text-sm transition-colors
        ${
          isActive
            ? "bg-gray-800 text-myers-yellow font-medium"
            : "text-gray-300 hover:bg-gray-800 hover:text-white"
        }
        ${!isSidebarExpanded ? "justify-center" : ""}
      `}
    >
      <span className="flex-shrink-0">{icon}</span>
      {isSidebarExpanded && <span className="ml-3">{label}</span>}
    </NavLink>
  );
};

const NestedMenuItem: React.FC<NestedMenuItemProps> = ({
  to,
  icon,
  label,
  subItems,
  isSidebarExpanded,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { hasPermission } = useAuth();

  // Filter subItems based on permissions
  const allowedSubItems = subItems.filter(
    (item) => !item.permission || hasPermission(item.permission as any)
  );

  if (allowedSubItems.length === 0) return null;

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center px-4 py-3 text-sm transition-colors
          ${
            isOpen
              ? "bg-gray-800 text-myers-yellow font-medium"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }
          ${!isSidebarExpanded ? "justify-center" : ""}
        `}
      >
        <span className="flex-shrink-0">{icon}</span>
        {isSidebarExpanded && (
          <>
            <span className="ml-3 flex-grow text-left">{label}</span>
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </>
        )}
      </button>

      {isOpen && isSidebarExpanded && (
        <div className="pl-12 bg-gray-850">
          {allowedSubItems.map((item) => (
            <NavLink
              key={item.to}
              to={`${to}/${item.to}`}
              className={({ isActive }) => `
                block px-4 py-2 text-sm transition-colors
                ${
                  isActive
                    ? "text-myers-yellow font-medium"
                    : "text-gray-400 hover:text-white"
                }
              `}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

interface SidebarProps {
  isExpanded: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded }) => {
  const { hasPermission } = useAuth();

  return (
    <aside
      className={`
        bg-myers-darkBlue text-white 
        fixed left-0 top-0 bottom-0 z-40
        transform transition-all duration-300 ease-in-out
        ${isExpanded ? "w-60" : "w-16"} 
        flex flex-col
      `}
    >
      <div className="h-16 flex items-center px-4 border-b border-gray-800">
        {isExpanded ? (
          <div className="flex items-center gap-x-2">
            <img src={logo} alt="Logo" className="w-8" />
            <h1 className="text-lg font-bold text-myers-yellow">
              Myers Security
            </h1>
          </div>
        ) : (
          <div className="w-8 flex items-center justify-center text-myers-darkBlue font-bold">
            <img src={logo} alt="User Avatar" />
          </div>
        )}
      </div>

      <div className="overflow-y-auto flex-grow scrollbar-hide">
        <nav className="mt-4 space-y-1 px-2">
          {hasPermission("users.read" as any) && (
            <MenuItem
              to="/dashboard"
              icon={<LayoutDashboard className="h-5 w-5" />}
              label="Dashboard"
              isSidebarExpanded={isExpanded}
            />
          )}

          {(hasPermission("users.read" as any) ||
            hasPermission("roles.read" as any)) && (
            <NestedMenuItem
              to="/users"
              icon={<Users className="h-5 w-5" />}
              label="User Management"
              isSidebarExpanded={isExpanded}
              subItems={[
                {
                  to: "admin-users",
                  label: "Admin Users",
                  permission: "users.read",
                },
                {
                  to: "support-engineers",
                  label: "Support Engineers",
                  permission: "users.read",
                },
              ]}
            />
          )}
          {hasPermission("dispensaries.read" as any) && (
            <MenuItem
              to="/knowledge-base"
              icon={<BookOpen className="h-5 w-5" />}
              label="Knowledge Base"
              isSidebarExpanded={isExpanded}
            />
          )}
          {hasPermission("dispensaries.read" as any) && (
            <MenuItem
              to="/dispensaries"
              icon={<Store className="h-5 w-5" />}
              label="Customers"
              isSidebarExpanded={isExpanded}
            />
          )}

          {hasPermission("serviceRequests.read" as any) && (
            <MenuItem
              to="/service-requests"
              icon={<TicketCheck className="h-5 w-5" />}
              label="Service Requests"
              isSidebarExpanded={isExpanded}
            />
          )}

          {/* {hasPermission('invoices.read' as any) && (
            <MenuItem
              to="/invoices"
              icon={<FileText className="h-5 w-5" />}
              label="Invoices"
              isSidebarExpanded={isExpanded}
            />
          )} */}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
