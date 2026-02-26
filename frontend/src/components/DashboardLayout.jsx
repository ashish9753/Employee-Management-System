import { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import { FiBell, FiCheck, FiClock, FiX, FiCalendar } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { getMyLeavesAPI, getAllLeavesAPI } from "../services/api";
import { Link } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  const { user } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const notifRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch notifications on mount
  useEffect(() => {
    if (!user) return;
    setLoading(true);

    if (user.role === "employee" || user.role === "manager") {
      // Show their own leave statuses
      getMyLeavesAPI()
        .then(({ data }) => {
          const notifs = data.leaves.slice(0, 10).map((l) => ({
            id: l._id,
            icon: l.status === "approved" ? "approved" : l.status === "rejected" ? "rejected" : "pending",
            title:
              l.status === "pending"
                ? `Leave application submitted`
                : l.status === "approved"
                ? `Leave approved`
                : `Leave rejected`,
            desc: `${l.leaveType.charAt(0).toUpperCase() + l.leaveType.slice(1)} leave · ${new Date(l.startDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} – ${new Date(l.endDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}`,
            time: new Date(l.updatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
            status: l.status,
          }));
          setNotifications(notifs);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else if (user.role === "admin" || user.role === "manager") {
      getAllLeavesAPI({ status: "pending" })
        .then(({ data }) => {
          const notifs = data.leaves.slice(0, 10).map((l) => ({
            id: l._id,
            icon: "pending",
            title: `${l.employee?.name} requested leave`,
            desc: `${l.leaveType.charAt(0).toUpperCase() + l.leaveType.slice(1)} leave · ${l.numberOfDays} day${l.numberOfDays !== 1 ? "s" : ""} · Pending approval`,
            time: new Date(l.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
            status: "pending",
          }));
          setNotifications(notifs);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user]);

  // For manager fetch both
  useEffect(() => {
    if (user?.role !== "manager") return;
    Promise.all([getMyLeavesAPI(), getAllLeavesAPI({ status: "pending" })])
      .then(([myRes, pendingRes]) => {
        const mine = myRes.data.leaves.slice(0, 5).map((l) => ({
          id: l._id,
          icon: l.status,
          title:
            l.status === "approved"
              ? "Your leave was approved"
              : l.status === "rejected"
              ? "Your leave was rejected"
              : "Your leave is pending",
          desc: `${l.leaveType.charAt(0).toUpperCase() + l.leaveType.slice(1)} leave · ${new Date(l.startDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} – ${new Date(l.endDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}`,
          time: new Date(l.updatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          status: l.status,
        }));
        const pending = pendingRes.data.leaves.slice(0, 5).map((l) => ({
          id: l._id + "_req",
          icon: "pending",
          title: `${l.employee?.name} requested leave`,
          desc: `${l.leaveType.charAt(0).toUpperCase() + l.leaveType.slice(1)} leave · ${l.numberOfDays} day${l.numberOfDays !== 1 ? "s" : ""} awaiting approval`,
          time: new Date(l.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          status: "pending",
        }));
        setNotifications([...pending, ...mine].slice(0, 10));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const unreadCount = notifications.filter((n) => n.status === "pending").length;

  const iconMap = {
    approved: (
      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
        <FiCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
      </div>
    ),
    rejected: (
      <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
        <FiX size={14} className="text-red-600 dark:text-red-400" />
      </div>
    ),
    pending: (
      <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
        <FiClock size={14} className="text-orange-600 dark:text-orange-400" />
      </div>
    ),
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        {/* Top header */}
        <header className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-end px-6 gap-3 sticky top-0 z-20 shadow-sm">

          {/* Notification bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen((o) => !o)}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition relative"
            >
              <FiBell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-orange-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {notifOpen && (
              <div className="absolute right-0 top-11 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-semibold px-2 py-0.5 rounded-full">
                      {unreadCount} pending
                    </span>
                  )}
                </div>

                {/* List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-700">
                  {loading ? (
                    <div className="py-8 text-center text-xs text-gray-400">Loading...</div>
                  ) : notifications.length === 0 ? (
                    <div className="py-10 text-center">
                      <FiCalendar size={24} className="text-gray-300 mx-auto mb-2" />
                      <p className="text-xs text-gray-400">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition">
                        {iconMap[n.icon] || iconMap.pending}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 leading-snug">{n.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{n.desc}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer link */}
                <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-2.5">
                  <Link
                    to={user?.role === "employee" ? "/employee/my-leaves" : user?.role === "manager" ? "/manager/requests" : "/admin/leaves"}
                    onClick={() => setNotifOpen(false)}
                    className="text-xs text-blue-600 font-medium hover:underline"
                  >
                    View all leave requests →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Avatar */}
          <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-blue-500 text-white font-bold text-sm cursor-pointer">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-8 py-3 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
          <span>&copy; 2025 LeaveMS. All rights reserved.</span>
          <span>
            Created by{" "}
            <a href="https://ashishdev.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 font-medium hover:underline transition">
              Ashish Sharma
            </a>
            {" "}&middot;{" "}
            <a href="https://ashishdev.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 hover:underline transition">
              ashishdev.com
            </a>
          </span>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
