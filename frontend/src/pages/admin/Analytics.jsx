import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getLeaveStatsAPI, getAllLeavesAPI } from "../../services/api";
import {
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiFileText,
  FiCalendar,
  FiTrendingUp,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LabelList,
} from "recharts";

const TYPE_COLORS = {
  annual: "#3b82f6",
  sick: "#ef4444",
  casual: "#f59e0b",
  unpaid: "#6b7280",
};

const STATUS_COLORS = {
  approved: "#22c55e",
  pending: "#f59e0b",
  rejected: "#ef4444",
};

const ALL_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-3 text-xs min-w-[130px]">
      <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
        {label}
      </p>
      {payload.map((p) => (
        <div
          key={p.dataKey}
          className="flex items-center justify-between gap-3 mb-1"
        >
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: p.fill }}
            />
            <span className="capitalize text-gray-600 dark:text-gray-300">
              {p.dataKey}
            </span>
          </div>
          <span className="font-bold text-gray-800 dark:text-white">
            {p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const Analytics = () => {
  const [statusStats, setStatusStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [typeStats, setTypeStats] = useState([]);
  const [monthlyChartData, setMonthlyChartData] = useState([]);
  const [yearlyChartData, setYearlyChartData] = useState([]);
  const [view, setView] = useState("monthly"); // "monthly" | "yearly"
  const [loading, setLoading] = useState(true);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    Promise.all([getLeaveStatsAPI(), getAllLeavesAPI({})])
      .then(([statsRes, leavesRes]) => {
        setStatusStats(statsRes.data.statusStats);
        setTypeStats(statsRes.data.typeStats);

        const leaves = leavesRes.data.leaves;

        // â”€â”€ Monthly data (last 12 calendar months) â”€â”€
        const monthMap = {};
        leaves.forEach((l) => {
          const d = new Date(l.createdAt);
          const key = d.toLocaleString("default", {
            month: "short",
            year: "numeric",
          });
          if (!monthMap[key])
            monthMap[key] = {
              month: key,
              annual: 0,
              sick: 0,
              casual: 0,
              unpaid: 0,
              _ts: d,
            };
          monthMap[key][l.leaveType] = (monthMap[key][l.leaveType] || 0) + 1;
        });
        const sortedMonthly = Object.values(monthMap)
          .sort((a, b) => a._ts - b._ts)
          .slice(-12)
          .map(({ _ts, ...rest }) => rest);
        setMonthlyChartData(sortedMonthly);

        // â”€â”€ Yearly data (current year, all 12 months) â”€â”€
        const yearMap = {};
        ALL_MONTHS.forEach((m) => {
          yearMap[m] = { month: m, annual: 0, sick: 0, casual: 0, unpaid: 0 };
        });
        leaves.forEach((l) => {
          const d = new Date(l.createdAt);
          if (d.getFullYear() === currentYear) {
            const m = ALL_MONTHS[d.getMonth()];
            yearMap[m][l.leaveType] = (yearMap[m][l.leaveType] || 0) + 1;
          }
        });
        setYearlyChartData(Object.values(yearMap));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total =
    statusStats.pending + statusStats.approved + statusStats.rejected;
  const pct = (val) => (total === 0 ? 0 : Math.round((val / total) * 100));

  const pieData = [
    {
      name: "Approved",
      value: statusStats.approved,
      color: STATUS_COLORS.approved,
    },
    {
      name: "Pending",
      value: statusStats.pending,
      color: STATUS_COLORS.pending,
    },
    {
      name: "Rejected",
      value: statusStats.rejected,
      color: STATUS_COLORS.rejected,
    },
  ].filter((d) => d.value > 0);

  const summaryCards = [
    {
      label: "Total Requests",
      value: total,
      icon: FiFileText,
      bg: "bg-blue-50",
      text: "text-blue-600",
      ring: "bg-blue-100",
    },
    {
      label: "Approved",
      value: statusStats.approved,
      icon: FiCheckCircle,
      bg: "bg-green-50",
      text: "text-green-600",
      ring: "bg-green-100",
    },
    {
      label: "Pending Review",
      value: statusStats.pending,
      icon: FiClock,
      bg: "bg-yellow-50",
      text: "text-yellow-600",
      ring: "bg-yellow-100",
    },
    {
      label: "Rejected",
      value: statusStats.rejected,
      icon: FiXCircle,
      bg: "bg-red-50",
      text: "text-red-600",
      ring: "bg-red-100",
    },
  ];

  const chartData = view === "monthly" ? monthlyChartData : yearlyChartData;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Analytics
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Leave trends and statistics overview
        </p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-6">
          {/* â”€â”€ Summary Cards â”€â”€ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {summaryCards.map(
              ({ label, value, icon: Icon, bg, text, ring }) => (
                <div
                  key={label}
                  className={`${bg} dark:bg-gray-800 rounded-2xl p-5 flex items-center gap-4 border border-white dark:border-gray-700 shadow-sm`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl ${ring} flex items-center justify-center ${text}`}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {value}
                    </p>
                    <p className={`text-xs font-medium ${text}`}>{label}</p>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* â”€â”€ Stacked Bar Chart (Monthly / Yearly) â”€â”€ */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h2 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <FiTrendingUp className="text-blue-500" />
                  Leave Applications by Type
                </h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {view === "monthly"
                    ? "Last 12 months breakdown"
                    : `${currentYear} full-year breakdown`}
                </p>
              </div>
              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl p-1 gap-1 self-start sm:self-auto">
                <button
                  onClick={() => setView("monthly")}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                    view === "monthly"
                      ? "bg-white dark:bg-gray-600 text-blue-600 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  <FiTrendingUp size={13} /> Monthly
                </button>
                <button
                  onClick={() => setView("yearly")}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                    view === "yearly"
                      ? "bg-white dark:bg-gray-600 text-blue-600 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  <FiCalendar size={13} /> {currentYear}
                </button>
              </div>
            </div>

            {chartData.length === 0 ||
            chartData.every(
              (d) => !d.annual && !d.sick && !d.casual && !d.unpaid,
            ) ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-300">
                <FiFileText size={36} />
                <p className="text-sm mt-2 text-gray-400">
                  No leave data available
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} barCategoryGap="30%" barGap={2}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "#f9fafb" }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
                    formatter={(value) => (
                      <span className="capitalize text-gray-600">
                        {value} Leave
                      </span>
                    )}
                  />
                  <Bar
                    dataKey="annual"
                    stackId="a"
                    fill={TYPE_COLORS.annual}
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="sick"
                    stackId="a"
                    fill={TYPE_COLORS.sick}
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="casual"
                    stackId="a"
                    fill={TYPE_COLORS.casual}
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="unpaid"
                    stackId="a"
                    fill={TYPE_COLORS.unpaid}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}

            {/* Legend color key */}
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              {Object.entries(TYPE_COLORS).map(([type, color]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-sm inline-block"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs capitalize text-gray-500 dark:text-gray-400">
                    {type} Leave
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* â”€â”€ Status Pie + Type breakdown â”€â”€ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Pie Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h2 className="font-semibold text-gray-800 dark:text-white mb-1">
                Status Distribution
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                {total} total requests
              </p>

              {total === 0 ? (
                <div className="flex flex-col items-center justify-center h-44 text-gray-300">
                  <FiFileText size={32} />
                  <p className="text-sm mt-2 text-gray-400">No requests yet</p>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        dataKey="value"
                        paddingAngle={3}
                      >
                        {pieData.map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={entry.color}
                            stroke="none"
                          />
                        ))}
                        <LabelList
                          dataKey="value"
                          position="inside"
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            fill: "#fff",
                          }}
                        />
                      </Pie>
                      <Tooltip
                        formatter={(val, name) => [
                          `${val} (${pct(val)}%)`,
                          name,
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3 flex-1">
                    {[
                      {
                        label: "Approved",
                        value: statusStats.approved,
                        color: STATUS_COLORS.approved,
                        bg: "bg-green-100 text-green-700",
                      },
                      {
                        label: "Pending",
                        value: statusStats.pending,
                        color: STATUS_COLORS.pending,
                        bg: "bg-yellow-100 text-yellow-700",
                      },
                      {
                        label: "Rejected",
                        value: statusStats.rejected,
                        color: STATUS_COLORS.rejected,
                        bg: "bg-red-100 text-red-700",
                      },
                    ].map(({ label, value, color, bg }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-800 dark:text-white">
                            {value}
                          </span>
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${bg}`}
                          >
                            {pct(value)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Leave Type Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h2 className="font-semibold text-gray-800 dark:text-white mb-1">
                Approved Leave by Type
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                Days consumed per category
              </p>
              {typeStats.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-44 text-gray-300">
                  <FiFileText size={32} />
                  <p className="text-sm mt-2 text-gray-400">
                    No approved leaves yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {typeStats.map((stat) => {
                    const color = TYPE_COLORS[stat._id] || "#6b7280";
                    const maxDays = Math.max(
                      ...typeStats.map((s) => s.totalDays),
                      1,
                    );
                    return (
                      <div key={stat._id}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 capitalize">
                              {stat._id} Leave
                            </span>
                          </div>
                          <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                            <span className="font-semibold text-gray-800 dark:text-white">
                              {stat.count}
                            </span>{" "}
                            reqs ·{" "}
                            <span className="font-semibold text-gray-800 dark:text-white">
                              {stat.totalDays}
                            </span>{" "}
                            days
                          </div>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${(stat.totalDays / maxDays) * 100}%`,
                              backgroundColor: color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Analytics;
