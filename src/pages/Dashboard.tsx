import React, { useEffect, useState } from "react";
import {
  Users,
  Store,
  TicketCheck,
  FileText,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Loader ,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { log } from "console";

// Type definitions
interface DashboardCounts {
  users: number;
  activeUsers: number;
  dispensaries: number;
  openDispensaries: number;
  serviceRequests: number;
  pendingRequests: number;
  inprogressRequests: number;
  invoices: number;
  paidInvoices: number;
  pendingInvoices:number;
}

const Dashboard: React.FC = () => {
  const [counts, setCounts] = useState<DashboardCounts>({
    users: 0,
    activeUsers: 0,
    dispensaries: 0,
    openDispensaries: 0,
    serviceRequests: 0,
    pendingRequests: 0,
    inprogressRequests: 0,
    invoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
  });

  const [requestsData, setRequestsData] = useState<
    { name: string; value: number }[]
  >([]);
  const [invoicesData, setInvoicesData] = useState<
    { name: string; value: number }[]
  >([]);
  const [filter, setFilter] = useState<"all" | "current" | "previous">("all");
  const [ticketGraphData, setTicketGraphData] = useState<
    { month: string; tickets: number }[]
  >([]);
  const [resolvedTotal, setResolvedTotal] = useState<number>(0);
  // moth-wise filter logic helper function
  const parseDate = (dateString: string) => {
    const parsed = new Date(dateString);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const isInCurrentMonth = (dateString: string) => {
    const date = parseDate(dateString);
    if (!date) return false;

    const now = new Date();
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };

  const isInPreviousMonth = (dateString: string) => {
    const date = parseDate(dateString);
    if (!date) return false;

    const now = new Date();
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return (
      date.getMonth() === prevMonth.getMonth() &&
      date.getFullYear() === prevMonth.getFullYear()
    );
  };

  const filterByDate = (items: any[]) => {
    if (filter === "current")
      return items.filter((item) => isInCurrentMonth(item.createdAt));
    if (filter === "previous")
      return items.filter((item) => isInPreviousMonth(item.createdAt));
    return items;
  };
  useEffect(() => {
    // Load data from localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const dispensaries = JSON.parse(
      localStorage.getItem("dispensaries") || "[]"
    );
    const serviceRequests = JSON.parse(
      localStorage.getItem("serviceRequests") || "[]"
    );
    const invoices = JSON.parse(localStorage.getItem("invoices") || "[]");
    // moth wise filter logic
    const filteredUsers = filterByDate(users);
    const filteredDispensaries = filterByDate(dispensaries);
    const filteredRequests = filterByDate(serviceRequests);
    const filteredInvoices = filterByDate(invoices);

    // Calculate counts
    const activeUsers = filteredUsers.filter(
      (user: any) => user.status === "active"
    ).length;
    const openDispensaries = filteredDispensaries.filter(
      (d: any) => d.status === "open"
    ).length;
    const pendingRequests = filteredRequests.filter(
      (r: any) => r.status === "pending"
    ).length;
    const paidInvoices = filteredInvoices.filter(
      (i: any) => i.status === "paid"
    ).length;    
    const pendingInvoices = filteredInvoices.filter(
      (r: any) => r.status === "pending"
    ).length;    
    const resolvedRequests = serviceRequests.filter(
      (r: any) => r.status === "resolved"
    );
    const inprogressRequests = filteredRequests.filter(
      (r: any) => r.status === "in-progress"
    ).length;
    const lastSixMonths = getLastSixMonths();

    const resolvedByMonth = lastSixMonths.map(({ label, year, month }) => {
      const count = resolvedRequests.filter((r: any) => {
        const date = new Date(r.createdAt);
        return date.getFullYear() === year && date.getMonth() === month;
      }).length;

      return {
        month: label,
        tickets: count,
      };
    });
    const totalResolvedCount = resolvedByMonth.reduce(
      (sum, item) => sum + item.tickets,
      0
    );

    setCounts({
      users: filteredUsers.length,
      activeUsers,
      dispensaries: filteredDispensaries.length,
      openDispensaries,
      serviceRequests: filteredRequests.length,
      pendingRequests,
      invoices: filteredInvoices.length,
      paidInvoices,
      inprogressRequests,
      pendingInvoices,
    });
    setTicketGraphData(resolvedByMonth);
    setResolvedTotal(totalResolvedCount);
    setRequestsData([
      {
        name: "Pending",
        value: filteredRequests.filter((r: any) => r.status === "pending")
          .length,
      },
      {
        name: "In Progress",
        value: filteredRequests.filter((r: any) => r.status === "in-progress")
          .length,
      },
      {
        name: "Resolved",
        value: filteredRequests.filter((r: any) => r.status === "resolved")
          .length,
      },
    ]);

    setInvoicesData([
      {
        name: "Pending",
        value: filteredInvoices.filter((i: any) => i.status === "pending")
          .length,
      },
      {
        name: "Paid",
        value: filteredInvoices.filter((i: any) => i.status === "paid").length,
      },
      {
        name: "Overdue",
        value: filteredInvoices.filter((i: any) => i.status === "overdue")
          .length,
      },
    ]);
  }, [filter]);

  // Colors for the pie charts
  const COLORS = ["#FFB020", "#3E79F7", "#10B981", "#F04438"];

  // Monthly revenue data (mocked)

  const getLastSixMonths = () => {
    const months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: date.toLocaleString("default", { month: "short" }),
        year: date.getFullYear(),
        month: date.getMonth(),
      });
    }

    return months;
  };

  const statCards = [
    {
      title: "Total Users",
      count: counts.users,
      active: counts.activeUsers,
      icon: <Users className="h-12 w-12 text-blue-600 dark:text-blue-400" />,
      activeLabel: "Active User(s)",
      color: "blue",
    },
    {
      title: "Cutomers",
      count: counts.dispensaries,
      active: counts.openDispensaries,
      icon: <Store className="h-12 w-12 text-green-600 dark:text-green-400" />,
      activeLabel: "Open Dispensaries",
      color: "green",
    },
    {
      title: "Support Tickets",
      count: counts.serviceRequests,
      active: counts.pendingRequests,
      inprogrss: counts.inprogressRequests,
      icon: (
        <TicketCheck className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
      ),
      activeLabel: "Pending",
      color: "yellow",
      progrsLabel: "inProgress",
      prgcolor: "purple",
    },
    {
      title: "Invoices",
      count: counts.invoices,
      active: counts.pendingInvoices,
      inprogrss: counts.paidInvoices,
      icon: (
        <FileText className="h-12 w-12 text-purple-600 dark:text-purple-400" />
      ),
      activeLabel: "Pending",
      color: "yellow",
      progrsLabel: "Paid",
      prgcolor: "purple",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Welcome to Myers Security admin dashboard
          </p>
        </div>
        <div>
          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as "all" | "current" | "previous")
            }
            className="border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 mb-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option value="all">All</option>
            <option value="current">Current Month</option>
            <option value="previous">Previous Month</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg overflow-hidden relative card-hover"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {card.count}
                </p>
              
              </div>
              <div className="items-start">{card.icon}</div>
            </div> 
              <div className="flex items-center mt-3">
                  {card.title === "Support Tickets" || card.title === "Invoices" ? (
                    <div className="flex justify-between flex-wrap w-full gap-2">
                      <div className="text-xs font-medium px-2 py-1 rounded-full flex items-center bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {card.active} {card.activeLabel}
                      </div>
                      <div className="text-xs font-medium px-2 py-1 rounded-full flex items-center bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {card.inprogrss} {card.progrsLabel}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`text-xs font-medium px-2 py-1 rounded-full flex items-center 
      bg-${card.color}-100 text-${card.color}-800 dark:bg-${card.color}-900/30 dark:text-${card.color}-300`}
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {card.active} {card.activeLabel}
                    </div>
                  )}
                </div>
            </div>
          
        ))}
      </div>

      {/* Revenue Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Tickets Overview
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Past 6 months
            </div>
          </div>

          <div className="flex items-center mb-6">
            <div className="mr-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Resolved Tickets
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {resolvedTotal}{" "}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Ticket(s)
                </span>
              </p>
            </div>
            <div className="px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% from last month
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ticketGraphData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF" }}
                  tickFormatter={(value) => `${value}`}
                  allowDecimals={false}
                  label={{
                    value: "Resolved Ticket Graph",
                    angle: -90,
                    position: "insideLeft",
                    style: {
                      textAnchor: "middle",
                      fill: "#9CA3AF",
                      fontSize: 12,
                      fontWeight: "bold",
                    },
                  }}
                />
                <Tooltip
                  formatter={(value: any) => [`${value}`, "Resolved"]}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderColor: "#E5E7EB",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar
                  dataKey="tickets"
                  fill="#FEF001"
                  radius={[4, 4, 0, 0]}
                  barSize={35}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Status charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Support Tickets by Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Support Tickets by Status
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={requestsData}
                  cx="50%"
                  cy="50%%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {requestsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend margin={{ top: 40 }} />
                <Tooltip formatter={(value: any) => [`${value}`, "Tickets"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Invoices by Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Invoices by Status
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={invoicesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {invoicesData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(value: any) => [`${value}`, "Invoices"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
