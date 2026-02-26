import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  getAllUsersAPI,
  getAllLeavesAPI,
  getLeaveStatsAPI,
} from "../../services/api";
import { FiUsers, FiCalendar, FiCheck, FiClock } from "react-icons/fi";

const AdminDashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllUsersAPI(), getLeaveStatsAPI(), getAllLeavesAPI({})])
      .then(([usersRes, statsRes, leavesRes]) => {
        setUserCount(usersRes.data.users.length);
        setStats(statsRes.data.statusStats);
        setRecentLeaves(leavesRes.data.leaves.slice(0, 6));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          System-wide overview
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Users"
          value={userCount}
          icon={FiUsers}
          color="purple"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={FiClock}
          color="yellow"
        />
        <StatCard
          title="Approved"
          value={stats.approved}
          icon={FiCheck}
          color="green"
        />
        <StatCard
          title="Total Leaves"
          value={stats.pending + stats.approved + stats.rejected}
          icon={FiCalendar}
          color="blue"
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          to="/admin/users"
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition">
              <FiUsers className="text-purple-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Manage Users
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {userCount} total users
              </p>
            </div>
          </div>
        </Link>
        <Link
          to="/admin/leaves"
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition">
              <FiCalendar className="text-blue-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">
                All Leave Requests
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats.pending} pending reviews
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Leaves */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200">
            Recent Leave Activity
          </h2>
          <Link
            to="/admin/leaves"
            className="text-sm text-purple-600 hover:underline"
          >
            View all
          </Link>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : recentLeaves.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">
            No activity yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                  <th className="pb-3 pr-4 font-medium">Employee</th>
                  <th className="pb-3 pr-4 font-medium">Type</th>
                  <th className="pb-3 pr-4 font-medium">Days</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {recentLeaves.map((leave) => (
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
                      {leave.numberOfDays}
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

export default AdminDashboard;
