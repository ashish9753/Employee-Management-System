import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { getMyLeavesAPI } from "../../services/api";
import { FiCalendar, FiCheck, FiClock, FiPlusCircle, FiChevronRight } from "react-icons/fi";

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyLeavesAPI()
      .then(({ data }) => setLeaves(data.leaves))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    pending: leaves.filter((l) => l.status === "pending").length,
    approved: leaves.filter((l) => l.status === "approved").length,
    balance:
      (user?.leaveBalance?.annual ?? 0) +
      (user?.leaveBalance?.sick ?? 0) +
      (user?.leaveBalance?.casual ?? 0),
  };

  const recentLeaves = leaves.slice(0, 6);

  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Employee Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
          Welcome back, {user?.name?.split(" ")[0]}!
        </p>
      </div>

      {/* Stat cards + Apply button */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Pending Leaves"
          value={stats.pending}
          icon={FiClock}
          color="yellow"
        />
        <StatCard
          title="Approved Leaves"
          value={stats.approved}
          icon={FiCheck}
          color="green"
        />
        <StatCard
          title="Leave Balance"
          value={`${stats.balance} Days`}
          icon={FiCalendar}
          color="teal"
        />
        <Link
          to="/employee/apply"
          className="rounded-2xl p-5 bg-[#1a2844] hover:bg-[#243660] text-white shadow-lg transition flex flex-col justify-between group"
        >
          <div className="flex items-start justify-between mb-4">
            <p className="text-sm font-medium text-white/80">Apply Leave</p>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <FiPlusCircle size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1 text-white font-semibold text-sm">
            Apply Now <FiChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Leave Balance breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 mb-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4 uppercase tracking-wider">
          Leave Balance Breakdown
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { type: "annual", label: "Annual", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
            { type: "sick", label: "Sick", color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300" },
            { type: "casual", label: "Casual", color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300" },
          ].map(({ type, label, color }) => (
            <div key={type} className={`rounded-xl p-4 text-center ${color}`}>
              <p className="text-2xl font-bold">{user?.leaveBalance?.[type] ?? 0}</p>
              <p className="text-xs font-medium mt-1">{label} Days</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent leave requests */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Recent Leave Requests
          </h2>
          <Link to="/employee/my-leaves" className="text-xs text-blue-600 hover:underline font-medium flex items-center gap-1">
            View all <FiChevronRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className="p-8"><LoadingSpinner /></div>
        ) : recentLeaves.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">No leave requests yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <th className="px-6 py-3">Leave Type</th>
                  <th className="px-6 py-3">From Date</th>
                  <th className="px-6 py-3">To</th>
                  <th className="px-6 py-3">Reason</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {recentLeaves.map((leave) => (
                  <tr key={leave._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                    <td className="px-6 py-4 capitalize font-medium text-gray-700 dark:text-gray-200">
                      {leave.leaveType} Leave
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {new Date(leave.startDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {new Date(leave.endDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 max-w-[160px] truncate">
                      {leave.reason || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={leave.status} />
                    </td>
                    <td className="px-6 py-4">
                      <FiChevronRight size={16} className="text-gray-400" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
