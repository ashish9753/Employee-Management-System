import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { getLeaveStatsAPI, getAllLeavesAPI } from "../../services/api";
import { FiCalendar, FiCheck, FiX, FiClock } from "react-icons/fi";

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getLeaveStatsAPI(), getAllLeavesAPI({ status: "pending" })])
      .then(([statsRes, leavesRes]) => {
        setStats(statsRes.data.statusStats);
        setRecent(leavesRes.data.leaves.slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Manager Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome back, {user?.name?.split(" ")[0]}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total"
          value={stats.pending + stats.approved + stats.rejected}
          icon={FiCalendar}
          color="blue"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={FiClock}
          color="yellow"
          subtitle="Awaiting review"
        />
        <StatCard
          title="Approved"
          value={stats.approved}
          icon={FiCheck}
          color="green"
        />
        <StatCard
          title="Rejected"
          value={stats.rejected}
          icon={FiX}
          color="red"
        />
      </div>

      {/* Pending Requests Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200">
            Pending Requests
          </h2>
          <Link
            to="/manager/requests"
            className="text-sm text-green-600 hover:underline font-medium"
          >
            View all &amp; Review →
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : recent.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">
            No pending requests
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                  <th className="pb-3 pr-4 font-medium">Employee</th>
                  <th className="pb-3 pr-4 font-medium">Type</th>
                  <th className="pb-3 pr-4 font-medium">Duration</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {recent.map((leave) => (
                  <tr
                    key={leave._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  >
                    <td className="py-3 pr-4 font-medium text-gray-700 dark:text-gray-200">
                      {leave.employee?.name}
                    </td>
                    <td className="py-3 pr-4 capitalize text-gray-600 dark:text-gray-400">
                      {leave.leaveType}
                    </td>
                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">
                      {leave.numberOfDays} days
                    </td>
                    <td className="py-3">
                      <StatusBadge status={leave.status} />
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

export default ManagerDashboard;
