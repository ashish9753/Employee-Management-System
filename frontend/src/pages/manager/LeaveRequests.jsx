import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import StatusBadge from "../../components/StatusBadge";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getAllLeavesAPI, reviewLeaveAPI } from "../../services/api";
import toast from "react-hot-toast";
import { FiCheck, FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const LeaveRequests = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewNote, setReviewNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchLeaves = () => {
    setLoading(true);
    const params = filter !== "all" ? { status: filter } : {};
    getAllLeavesAPI(params)
      .then(({ data }) => setLeaves(data.leaves))
      .catch(() => toast.error("Failed to load requests"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLeaves(); }, [filter]);

  const openReview = (leave, action) => {
    setReviewModal({ leave, action });
    setReviewNote("");
  };

  const handleReview = async () => {
    setSubmitting(true);
    try {
      await reviewLeaveAPI(reviewModal.leave._id, { status: reviewModal.action, reviewNote });
      toast.success(`Leave ${reviewModal.action} successfully`);
      setReviewModal(null);
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setSubmitting(false);
    }
  };

  const pendingCount = leaves.filter((l) => l.status === "pending").length;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manager Approval</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Review and manage employee leave requests</p>
        </div>
        {pendingCount > 0 && (
          <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 text-sm font-semibold px-4 py-2 rounded-full">
            {pendingCount} Pending
          </span>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {["all", "pending", "approved", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition capitalize ${
              filter === s
                ? s === "pending" ? "bg-orange-500 text-white shadow"
                  : s === "approved" ? "bg-emerald-500 text-white shadow"
                  : s === "rejected" ? "bg-red-500 text-white shadow"
                  : "bg-[#1a2844] text-white shadow"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10"><LoadingSpinner /></div>
        ) : leaves.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No leave requests found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <th className="px-6 py-3.5">Employee</th>
                  <th className="px-6 py-3.5">Leave Type</th>
                  <th className="px-6 py-3.5">From</th>
                  <th className="px-6 py-3.5">To</th>
                  <th className="px-6 py-3.5">Reason</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {leaves.map((leave) => (
                  <tr key={leave._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                          {leave.employee?.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-700 dark:text-gray-200">{leave.employee?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize text-gray-600 dark:text-gray-300">
                      {leave.leaveType} Leave
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {new Date(leave.startDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {new Date(leave.endDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-[150px] truncate">
                      {leave.reason || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={leave.status} />
                    </td>
                    <td className="px-6 py-4">
                      {leave.status === "pending" ? (
                        leave.employee?._id === user?._id ? (
                          <span className="text-xs text-amber-500 font-medium italic">Admin approval required</span>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => openReview(leave, "approved")}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition"
                            >
                              <FiCheck size={12} /> Approve
                            </button>
                            <button
                              onClick={() => openReview(leave, "rejected")}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition"
                            >
                              <FiX size={12} /> Reject
                            </button>
                          </div>
                        )
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className={`text-lg font-bold mb-1 capitalize ${reviewModal.action === "approved" ? "text-emerald-600" : "text-red-600"}`}>
              {reviewModal.action === "approved" ? "Approve" : "Reject"} Leave Request
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              <span className="font-medium text-gray-700 dark:text-gray-200">{reviewModal.leave.employee?.name}</span>
              {" "}&mdash; {reviewModal.leave.leaveType} ({reviewModal.leave.numberOfDays} days)
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Review Note <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Add a note for the employee..."
              />
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setReviewModal(null)}
                className="flex-1 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleReview}
                disabled={submitting}
                className={`flex-1 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-60 text-sm ${
                  reviewModal.action === "approved" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {submitting ? "Processing..." : `Confirm ${reviewModal.action === "approved" ? "Approval" : "Rejection"}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default LeaveRequests;
