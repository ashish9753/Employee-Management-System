import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import StatusBadge from "../../components/StatusBadge";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getAllLeavesAPI, reviewLeaveAPI } from "../../services/api";
import toast from "react-hot-toast";
import { FiCheck, FiX } from "react-icons/fi";

const AdminLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewNote, setReviewNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchLeaves = () => {
    setLoading(true);
    const params = filter !== "all" ? { status: filter } : {};
    getAllLeavesAPI(params)
      .then(({ data }) => setLeaves(data.leaves))
      .catch(() => toast.error("Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeaves();
  }, [filter]);

  const handleReview = async () => {
    setSubmitting(true);
    try {
      await reviewLeaveAPI(reviewModal.leave._id, {
        status: reviewModal.action,
        reviewNote,
      });
      toast.success(`Leave ${reviewModal.action}`);
      setReviewModal(null);
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          All Leave Requests
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          View and manage all employee leaves
        </p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "pending", "approved", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition capitalize ${filter === s ? "bg-purple-600 text-white" : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        {loading ? (
          <LoadingSpinner />
        ) : leaves.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            No records found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                <tr className="text-left text-gray-500 dark:text-gray-400">
                  <th className="px-6 py-4 font-medium">Employee</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">From</th>
                  <th className="px-6 py-4 font-medium">To</th>
                  <th className="px-6 py-4 font-medium">Days</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Reviewed By</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {leaves.map((leave) => (
                  <tr
                    key={leave._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-700 dark:text-gray-200">
                        {leave.employee?.name}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {leave.employee?.department}
                      </p>
                    </td>
                    <td className="px-6 py-4 capitalize text-gray-600 dark:text-gray-300">
                      {leave.leaveType}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {new Date(leave.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {leave.numberOfDays}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={leave.status} />
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                      {leave.reviewedBy?.name || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {leave.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setReviewModal({ leave, action: "approved" });
                              setReviewNote("");
                            }}
                            className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                          >
                            <FiCheck size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setReviewModal({ leave, action: "rejected" });
                              setReviewNote("");
                            }}
                            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {reviewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1 capitalize">
              {reviewModal.action} Leave
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {reviewModal.leave.employee?.name} — {reviewModal.leave.leaveType}{" "}
              ({reviewModal.leave.numberOfDays} days)
            </p>
            <textarea
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Review note (optional)"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setReviewModal(null)}
                className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleReview}
                disabled={submitting}
                className={`flex-1 text-white font-semibold py-2.5 rounded-lg text-sm transition disabled:opacity-60 ${reviewModal.action === "approved" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
              >
                {submitting
                  ? "Processing..."
                  : `Confirm ${reviewModal.action.charAt(0).toUpperCase() + reviewModal.action.slice(1)}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminLeaves;
